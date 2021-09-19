const axios = require('axios')

const base_url = "https://api.hypixel.net/skyblock/auctions?page="
// stuff to remove
const REFORGES = [
    " ✦", "⚚ ", " ✪", "✪", "Stiff ", 
    "Lucky ", "Jerry's ", "Dirty ", "Fabled ", 
    "Suspicious ", "Gilded ", "Warped ", "Withered ", 
    "Bulky ", "Stellar ", "Heated ", "Ambered ", "Fruitful ", 
    "Magnetic ", "Fleet ", "Mithraic ", "Auspicious ", "Refined ", 
    "Headstrong ", "Precise ", "Spiritual ", "Moil ", "Blessed ", "Toil ", 
    "Bountiful ", "Candied ", "Submerged ", "Reinforced ", "Cubic ", "Warped ", 
    "Undead ", "Ridiculous ", "Necrotic ", "Spiked ", "Jaded ", "Loving ", "Perfect ", 
    "Renowned ", "Giant ", "Empowered ", "Ancient ", "Sweet ", "Silky ", "Bloody ", 
    "Shaded ", "Gentle ", "Odd ", "Fast ", "Fair ", "Epic ", "Sharp ", "Heroic ", 
    "Spicy ", "Legendary ", "Deadly ", "Fine ", "Grand ", "Hasty ", "Neat ", 
    "Rapid ", "Unreal ", "Awkward ", "Rich ", "Clean ", "Fierce ", 
    "Heavy ", "Light ", "Mythic ", "Pure ", "Smart ", "Salty ",
    "Titanic ", "Wise ", "Bizarre ", "Itchy ", 
    "Ominous ", "Pleasant ", "Pretty ", 
    "Shiny ", "Simple ", "Strange ", "Vivid ", 
    "Godly ", "Demonic ", "Forceful ", "Hurtful ", "Keen ", 
    "Strong ", "Superior ", "Unpleasant ", "Zealous "
]


let toppage, now,
    results = {}



async function snipe() {

    const res = await axios.get(base_url + 0)

    console.log('Preparing to snipe!')
    if (now == res.data['lastUpdated']) return false
    console.log('Fetching HYPIXEL data!')

    results = {}
    now = res.data['lastUpdated']
    toppage = res.data['totalPages']
    const auctions = [...res.data.auctions]


    const step = 5

    for (let base = 0; base < toppage / step; base++) {
        const req = []
        for (let page = 1; page <= step; page++) {
            const p = (base * step + page)
            try {
                console.log('request ' + base_url + p)
                const r = axios.get(base_url + p)
                r.then((res) => {
                    console.log('response ' + base_url + p)
                    toppage = res.data['totalPages']
                    auctions.push(...res.data.auctions)
                })
                req.push(r)
            } catch (error) {
                console.log(error)
            }
        }
        try {
            await Promise.all(req)
        } catch (error) {

        }
    }

    parseAuctions(auctions)
    return results
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, match, replacement) {
    return str.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement);
}

function parseAuctions(auctions) {
    const counts = {}
    for (const i in auctions) {
        const auction = auctions[i]
        // if the auction isn't a) claimed and is b) BIN
        if (!auction['claimed'] && auction.bin && !auction["item_lore"].includes('Furniture')) {

            // removes level if it's a pet, also 
            let index = auction['item_name'].replace("\[.*\]", "") + auction['tier']
            // removes reforges and other yucky characters
            REFORGES.map(x => index = replaceAll(index, x, ""))

            // if the current item already has a price in the prices map, the price is updated
            if (results[index]) {

                const count = results[index].count + 1
                if (auction['starting_bid'] < results[index].price) {

                    results[index] = {
                        uuid: auction['uuid'],
                        name: auction['item_name'],
                        price: auction['starting_bid'],
                        next_price: results[index].price,
                        price_float: results[index].price - auction['starting_bid'],
                        price_float_percent: Math.floor(results[index].price / auction['starting_bid'] * 100 - 100) + '%',
                        tier: auction['tier'],
                        count: count
                    }
                } else if (auction['starting_bid'] < results[index].next_price) {
                    results[index].next_price = auction['starting_bid']
                    results[index].count = count
                }

            } else {
                results[index] = {
                    uuid: auction['uuid'],
                    name: auction['item_name'],
                    price: auction['starting_bid'],
                    tier: auction['tier'],
                    next_price: false,
                    count: 1
                }
            }

        }
    }

}

module.exports = {
    snipe: snipe
}