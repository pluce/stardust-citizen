import React from 'react'

function Donate(props) {
    return (
        <form style={{ margin: "0px 10px" }} action="https://www.paypal.com/donate" method="post" target="_top">
            <input type="hidden" name="hosted_button_id" value="4EEEQ55LS5K64" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
            <img alt="" style={{display: "none"}} border="0" src="https://www.paypal.com/en_FR/i/scr/pixel.gif" width="1" height="1" />
        </form>
    )
}
export default Donate