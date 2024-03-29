const { GraphQLClient, gql } = require('graphql-request')
const { promises } = require('fs')
const fs = promises
const { Graph, json } = require("@dagrejs/graphlib");
const headers = {
  "accept": "*/*",
  "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
  "content-type": "application/json",
  "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
  "sec-ch-ua-mobile": "?0",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "origin": "https://robertsspaceindustries.com",
  "cookie": "",
  "referer": "https://robertsspaceindustries.com/pledge"
}

const listShips = gql`
query initShipUpgrade {
  ships {
    id
    name
    medias {
      productThumbMediumAndSmall
      slideShow
    }
    manufacturer {
      id
      name
    }
    focus
    type
    flyableStatus
    owned
    msrp
    link
    skus {
      id
      title
      available
      price
      body
      unlimitedStock
      availableStock
    }
  }
  manufacturers {
    id
    name
  }
  app {
    version
    env
    cookieName
    sentryDSN
    pricing {
      currencyCode
      currencySymbol
      exchangeRate
      taxRate
      isTaxInclusive
    }
    mode
    isAnonymous
    buyback {
      credit
    }
  }
}
`

const shipCCU = gql`
query filterShips($fromId: Int) {
    to(from: $fromId) {
      ships {
        id
        skus {
          id
          title
          price
          upgradePrice
          unlimitedStock
          showStock
          available
          availableStock
          limitedTimeOffer
          body
          items {
            id
            title
          }
          medias {
            storeThumbSkuDetail
          }
        }
      }
    }
  }
  `


const endpoint = "https://robertsspaceindustries.com/pledge-store/api/upgrade"

const graphQLClient = new GraphQLClient(endpoint, {
  headers
})

const edges = {}

const graph = new Graph({ directed: true, multigraph: true })

console.log("Getting auth token.")
fetch("https://robertsspaceindustries.com/api/account/v2/setAuthToken", { method: "POST" })
  .then((res) => {
    graphQLClient.setHeader('cookie', `Rsi-Account-Auth${res.headers.get("set-cookie").split("Rsi-Account-Auth")[1]}`)
    console.log("Downloading ships data.")
    return graphQLClient.request(listShips)
  })
  .then((data) => {
    data.ships.push({
      "id": 0,
      "name": "! No ship ! Tell me the best from nothing",
      "medias": {
        "slideShow": "https://via.placeholder.com/648x366"
      },
      "manufacturer": {
        "id": 0,
        "name": "Pluce"
      }
    })
    data.ships.forEach((ship) => {
      if (ship.skus) {
        ship.skus = ship.skus.map(sku => ({ ...sku, price: sku.price * 1.2 }))
      }
      graph.setNode(ship.id, ship)
    })
    return data.ships
  }).then((ships) => {
    console.log(`Got ${graph.nodeCount()} ships.`)
    const promises = ships.map(s => {
      if (s.skus && s.skus.length > 0) {
        const skus = s.skus.filter(x => x.available && (x.unlimitedStock || x.availableStock != null))
        skus.forEach(sku => {
          const fake_sku_id = 100000 + parseInt(s.id)
          graph.setEdge(
            "0",
            s.id,
            {
              "id": fake_sku_id,
              "title": sku.title,
              "price": sku.price,
              "upgradePrice": sku.price,
              "unlimitedStock": true,
              "showStock": true,
              "available": true,
              "availableStock": 0,
              "type": "rsi"
            },
            fake_sku_id
          )
        })
      }
      return graphQLClient.request(shipCCU, {
        "fromId": s.id
      }).then((data) => {
        if (s.id != 0) {
          data.to.ships.forEach(tship => {
            tship.skus.forEach(sku => {
              graph.setEdge(
                s.id,
                tship.id,
                { ...sku, type: "rsi", upgradePrice: sku.upgradePrice * 1.2 },
                sku.id
              )
            })
          })
        }
      })
    })
    return Promise.all(promises)
  }).then(() => {
    fs.writeFile("./app/data/graph.json", JSON.stringify(json.write(graph), null, 2))
    const ccus = json.write(graph).edges.filter(e => e.v != "0").map(e =>
    ({
      ...e.value,
      from: { id: graph.node(e.v).id, name: graph.node(e.v).name },
      to: { id: graph.node(e.w).id, name: graph.node(e.w).name }
    }))
    ccus.sort((a, b) => (a.to.name > b.to.name) ? 1 : ((b.to.name > a.to.name) ? -1 : 0))
    fs.writeFile("./app/data/ccus.json", JSON.stringify(ccus, null, 2))

    const ships = json.write(graph).nodes.map(n => n.value)
    ships.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    fs.writeFile("./app/data/ships.json", JSON.stringify(ships, null, 2))
    console.log(`Got ${graph.edgeCount()} edges.`)
    console.log("Ok, everything saved !")
  })