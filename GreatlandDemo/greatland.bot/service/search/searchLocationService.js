const GLOBAL = require('../../GLOBAL_VARS.json');
const utils = require('../../utilities/utilitieFunc');

module.exports = {
    dynamicSearchMessage: function (data, start, dataTotalCount, options, defaultCat,defaultType,channel) {
        var messages = [];
        var end = (dataTotalCount - start > GLOBAL.SEARCH.MAX_PAGE_SIZE) ? start + GLOBAL.SEARCH.MAX_PAGE_SIZE : start + (dataTotalCount - start);

        //Information count
        if (dataTotalCount > 0) {
            messages.push({
                "message": {
                    "text": (start + 1) + "-" + end + " of " + dataTotalCount + " Properities👇"
                }
            });

            //Create properties card
            messages.push({
                "message": {
                    "attachment": {
                        "payload": {
                            "elements": createSearchGallery(data, start, dataTotalCount,channel),
                            "template_type": "generic"
                        },
                        "type": "template"
                    }
                }
            });
        } else {
            messages.push({
                "message": {
                    "text": "Sorry! Nothing found. Please refine your search."
                }
            });
        }

        //Send followup message
        messages.push({
            "message": {
                "text": "Discover more treasures in our diverse range of products! 🌟🛒🔍",
                "quick_replies": createSearchQuickReplies(options, defaultCat,defaultType) // Adjust parameters as needed
            }
        });

        return messages;
    }
};

// Define the createSearchGallery function

function createSearchGallery(data, start, dataTotalCount, channel) {
  var cards = [];

  data.forEach((item) => {
    var buttons = [];

    buttons.push(
      //call 🏡Property Details in the platform
      utils.setFlowIdAndCufInButtons("🖼️More Info", "1704649731037",
        ["property_id", data[0]._source["id"]]
      )
    );

    if (item._source["Sample Computation"] !== '-') {
      buttons.push({
        "title": "📈Sample Computation",
        "type": "web_url",
        "url": item._source["Sample Computation"]
      });
    }


    buttons.push(
      //call (4 - Real Estate - Get Email 📧 in the platform)
      utils.setFlowIdAndCufInButtons("🤩🏡I'm Interested", "1703929289958",
        ["property_id", data[0]._source["id"]],
        ["property_name", data[0]._source["House Name"]],
        ["property_user_bedroom", data[0]._source["Bedrooms"]],
        ["property_user_budget", data[0]._source["Price"]],
        ["property_user_location", data[0]._source["Location"]]
      )
    );


    var card = {
      "title": item._source["House Name"] + ", 📍" + item._source.Location,
      "subtitle":
        "💰Price : " + GLOBAL.SEARCH.CURRENCY_SYMBOL + item._source.Price.toLocaleString(GLOBAL.SEARCH.CURRENCY_LOCAL_DENOMINATION, { style: 'decimal', useGrouping: true, minimumFractionDigits: 0 }) +
        "\n🛏️Bedrooms : " + item._source.Bedrooms +
        "\n📏Total Area : " + item._source["Size"] + " sqm",
      "image_url": item._source["Cover Picture"],
      "buttons": buttons
    };

    cards.push(card);
  });

  //Last card as pagination
  if (dataTotalCount > (start + GLOBAL.SEARCH.MAX_PAGE_SIZE)) {

    var card = {
      "title": "Tap for more👇",
      "image_url": GLOBAL.FLOW.NEXT_PAGE_CARDS.IMAGE,
      "buttons": [{
        "title": GLOBAL.FLOW.NEXT_PAGE_CARDS.TEXT,
        "type": "postback",
        "payload": JSON.stringify({
          "actions": [
            {
              "action": "set_field_value",
              "field_name": "card-search-index",
              "value": start + GLOBAL.SEARCH.MAX_PAGE_SIZE
            }, {
              "action": "send_flow",
              "flow_id": GLOBAL.FLOW.NEXT_PAGE_CARDS.FLOW_ID //add to cart flow
            }
          ]
        })
      }]
    };

    cards.push(card);
  }

  return cards;

}





function createSearchQuickReplies(options, defaultCat, defaultType) {
  var quickReplies = [];

  /*
    if (start != 0) {
      var quickReply = setFlowIdAndCufInQuickReply("◀️Back", "1688916910534",["card-search-index", start - 10] );
      quickReplies.push(quickReply);
    }
  
    if (dataTotalCount > (start + 10)) {
      var quickReply = setFlowIdAndCufInQuickReply("Next▶️", "1688916910534",["card-search-index", start + 10] );
      quickReplies.push(quickReply);
    }
  
  */

  options.forEach((item) => {
    var quickReply = utils.setFlowIdAndCufInQuickReply(item, GLOBAL.FLOW.QUICK_REPLIES.FLOW_ID, ["A1", item], ["Q1", defaultCat], ["T1", defaultType], ["card-search-index", 0]);
    quickReplies.push(quickReply);
  });

  quickReplies.push({
    "content_type": "text",
    "title": GLOBAL.FLOW.QUICK_SEARCH.TEXT,
    "payload": JSON.stringify({
      "actions": [{
        "action": "send_flow",
        "flow_id": GLOBAL.FLOW.QUICK_SEARCH.FLOW_ID//Calling Search
      }]
    })
  });

  return quickReplies;
}

