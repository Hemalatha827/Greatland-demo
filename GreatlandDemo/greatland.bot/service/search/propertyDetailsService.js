const GLOBAL = require('../../GLOBAL_VARS.json');
const utils = require('../../utilities/utilitieFunc');

module.exports={
 dynamicPropertyDetMessage:function(data) {
        var messages = [];
      
        //Property Gallery
        const galleryCards = [];
        if (data[0]._source["Cover Picture"] && data[0]._source["Cover Picture"] != "-") {
          galleryCards.push({
            "title": data[0]._source["House Name"],
            "subtitle": data[0]._source["House Name"],
            "image_url": data[0]._source["Cover Picture"]
          }
          );
        }
        if (data[0]._source["Gallery"] && data[0]._source["Gallery"] != "-") {
      
      
          for (let i = 1; i <= 4; i++) {
            const imgVar = "Gallery-Img" + i;
            if (data[0]._source[imgVar] && data[0]._source[imgVar] != "-") {
              galleryCards.push({
                "title": data[0]._source["House Name"],
                "subtitle": data[0]._source["House Name"],
                "image_url": data[0]._source[imgVar]
              }
              );
            }
          }
          galleryCards.push({
            "title": "Gallery",
            "image_url": GLOBAL.FLOW.MORE_GAL_CARDS.IMAGE,
            "buttons": [
              {
                "title": "🖼️Complete Gallery",
                "type": "web_url",
                "url": data[0]._source["Gallery"]
              }]
          }
          );
      
        }
      
        //Property Gallery
        messages.push({
          "message": {
            "attachment": {
              "payload": {
                "elements": galleryCards,
                "template_type": "generic"
              },
              "type": "template"
            }
          }
        });
      
         const description = data[0]._source["Description"] || "";
        const maxDescriptionLength = 500; // Set your custom truncation length
        const truncatedDescription = description.length > maxDescriptionLength
          ? description.substring(0, maxDescriptionLength) + "..." // Truncate with ellipsis
          : description;
      
      
        let details =
          "🏠" + data[0]._source["House Name"] + "\n\n";
      
        if (data[0]._source["Description"] && data[0]._source["Description"] != "-") {
      
          details += truncatedDescription +"\n\n";
        }
      
        details += "🛏️" + data[0]._source["Bedrooms"] + " Bedrooms\n" +
          "🚿" + data[0]._source["Bathrooms"] + " Bathrooms\n" +
          "📏" + data[0]._source["Size"] + " sqm"
          ;
        const button = [];
      
        if (data[0]._source["Video Tour"] && data[0]._source["Video Tour"] != "-") {
          button.push({
            "title": "📹Video Tour",
            "type": "web_url",
            "url": data[0]._source["Video Tour"]
          });
        }
        if (data[0]._source["Sample Computation"] && data[0]._source["Sample Computation"] != "-") {
          button.push({
            "title": "📈Sample Computation",
            "type": "web_url",
            "url": data[0]._source["Sample Computation"]
          });
        }
      
        button.push(
          //call (4 - Real Estate - Get Email 📧 in the platform)
         utils.setFlowIdAndCufInButtons("🤩🏡I'm Interested", "1703929289958",
            ["property_id", data[0]._source["id"]],
            ["property_name", data[0]._source["House Name"]],
            ["property_user_bedroom", data[0]._source["Bedrooms"]],
            ["property_user_budget", data[0]._source["Price"]],
            ["property_user_location", data[0]._source["Location"]]
          )
        );
      
        //Property Details(price, bedroom, bathroom,..)
        messages.push({
          "message": {
            "attachment": {
              "payload": {
                "text": details,
                "buttons": button,
                "template_type": "button"
              },
              "type": "template"
            }
          }
        });
      
        return messages;
      }
      
      


}