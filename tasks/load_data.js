const { GraphQLClient, gql } = require('graphql-request')
const { promises } = require('fs')
const fs = promises

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
    "cookie": process.env.RSI_COOKIE_CONTENT,
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
          price
          upgradePrice
          unlimitedStock
          showStock
          available
          availableStock
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

console.log("Downloading ships data.")
graphQLClient.request(listShips).then((data) => {
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
    fs.writeFile("./app/data/ships.json", JSON.stringify(data.ships))
    return data.ships
}).then((ships) => {
    console.log(`Got ${ships.length} ships.`)
    edges[0] = []
    const promises = ships.map(s => {
        console.log(s)
        if(s.skus && s.skus.length > 0) {
            const skus = s.skus.filter(x => x.available && (x.unlimitedStock || x.availableStock != null))
            if(skus.length > 0) {
                const theSku = skus.sort((a,b) => a.price - b.price)[0]
                console.log(theSku)
                edges[0].push(
                    { 
                        id: s.id,
                        skus: [
                            {
                                "id": 100000+parseInt(s.id),
                                "price": theSku.price,
                                "upgradePrice": theSku.price,
                                "unlimitedStock": true,
                                "showStock": true,
                                "available": true,
                                "availableStock": 0
                        }]
                    })
                console.log(edges[0][s.id])
            }
        }
        return graphQLClient.request(shipCCU, {
            "fromId": s.id
        }).then((data) => {
            if(s.id != 0) {
                edges[s.id] = data.to.ships
            }
        })
    })
    return Promise.all(promises)
}).then(() => {
    console.log(`Got ${Object.keys(edges).length} edges.`)
    fs.writeFile("./app/data/edges.json", JSON.stringify(edges))
    console.log("Ok, everything saved !")
})
