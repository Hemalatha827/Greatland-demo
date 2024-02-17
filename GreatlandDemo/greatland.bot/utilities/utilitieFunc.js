const CryptoJS = require('crypto-js');
const { parse } = require('date-fns');
const GLOBAL = require('../GLOBAL_VARS.json');

module.exports = {
    createButtonOrQuickReply(type, displayTxt, ...data) {
        const actions = this.createCUFActions(...data);
        let buttonOrquickReply = {
            "title": displayTxt,
            "payload": JSON.stringify({ "actions": actions })
        };

        if (type == "button") {
            buttonOrquickReply.type = "postback";
        } else {
            buttonOrquickReply.content_type = "text";
        }

        return buttonOrquickReply;
    },


    /**
    * @param {string} title
    * @param {number} flowId
    * @param {string[]} arg
    */
    setFlowIdAndCufInQuickReply(title, flowId, ...arg) {
        let actions = [];
        arg.forEach(function (currentValue) {
            actions.push({
                "action": "set_field_value",
                "field_name": currentValue[0],
                "value": currentValue[1]
            });
        });

        actions.push(
            {
                "action": "send_flow",
                "flow_id": flowId //same flow called again just by updating the pageIndex
            }
        );

        var quickReplies = JSON.stringify({
            "actions": actions
        });

        var quickReply = {
            "content_type": "text",
            "title": title,
            "payload": quickReplies
        };
        return quickReply;
    },


    /**
    * @param {string} title
    * @param {number} flowId
    * @param {string[]} arg
    */
    setFlowIdAndTagInButtons(title, flowId, ...arg) {
        let actions = [];
        arg.forEach(function (currentValue) {
            actions.push({
                "action": currentValue[0] == "add" ? "add_tag" : "remove_tag",
                "tag_name": currentValue[1]
            });
        });

        actions.push(
            {
                "action": "send_flow",
                "flow_id": flowId //same flow called again just by updating the pageIndex
            }
        );

        var buttton = {
            "type": "postback",
            "title": title,
            "payload": JSON.stringify({ "actions": actions })
        };
        return buttton;
    },

     setFlowIdAndCufInButtons(title, flowId, ...arg) {
        let actions = [];
        arg.forEach(function (currentValue) {
          actions.push({
            "action": "set_field_value",
            "field_name": currentValue[0],
            "value": currentValue[1]
          });
        });
      
        actions.push(
          {
            "action": "send_flow",
            "flow_id": flowId //same flow called again just by updating the pageIndex
          }
        );
      
        var buttton = {
          "type": "postback",
          "title": title,
          "payload": JSON.stringify({ "actions": actions })
        };
        return buttton;
      },



    getRowNumByCellValue(values, searchValue) {

        for (let rowIndex = 0; rowIndex < values.length; rowIndex++) {
            const row = values[rowIndex];
            const columnIndex = row.indexOf(searchValue);
            if (columnIndex !== -1) {
                const rowNum = rowIndex + 1; // Adding 1 because row index is 0-based, but row numbers are 1-based in Sheets
                return rowNum; // If you want to use this value further, you can return it from the function
            }
        }

        Logger.log(`'${searchValue}' not found in the sheet.`);
        return null; // If the value is not found, you can return null or any other value indicating that it's not present in the sheet.
    },

    getValueBasedOnAnotherColumn(data, searchColumn, searchValue) {
        let targetValue;
        const header = data[1];

        // Iterate over the rows and find the matching value in the search column
        for (let i = 2; i < data.length; i++) {
            if (String(data[i][header.indexOf(searchColumn)]) == String(searchValue)) {
                targetValue = data[i];
                break;
            }
        }

        var targetData = {};
        if (targetValue != null)
            targetValue.forEach((element, index) => {
                targetData[header[index]] = element;
            });

        return targetData;
    },




     getRowDataBasedOnKey(data, searchColumn, searchValue) {
        let targetValue;
        const header = data[0];
      
        // Iterate over the rows and find the matching value in the search column
        for (let i = 1; i < data.length; i++) {
          if (String(data[i][header.indexOf(searchColumn)]) == String(searchValue)) {
            targetValue = data[i];
            break;
          }
        }
      
        var targetData = {};
        if (targetValue != null)
          targetValue.forEach((element, index) => {
            targetData[header[index]] = element;
          });
      
        return targetData;
      },
      

    getRangeBasedOnValue(data, searchValue, searchType) {

        // Iterate over the rows and find the matching value in the search column
        for (let i = 2; i < data.length; i++) {
            const lowerBound = data[i][1];
            const upperBound = data[i][2];
            const type = data[i][3];

            if (type === searchType) {
                if (lowerBound !== '-' && upperBound !== '-') {
                    if (searchValue >= lowerBound && searchValue <= upperBound) {
                        return data[i][0];
                    }
                } else if (lowerBound === '-') {
                    if (searchValue <= upperBound) {
                        return data[i][0];
                    }
                } else if (upperBound === '-') {
                    if (searchValue >= lowerBound) {
                        return data[i][0];
                    }
                }
            }
        }

    },

    generateUniqueSixDigitID() {
        const timestamp = Date.now().toString(); // Get the current timestamp
        const randomPart = Math.floor(Math.random() * 900000) + 100000; // Random 6-digit number
        const uniqueID = timestamp.slice(-6) + randomPart.toString();
        return uniqueID.slice(0, 6); // Ensure it's exactly 6 digits long
    },

    
     getCurrentDateInDDMMYYYY() {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
      
        return `${day}.${month}.${year}`;
      },
      
      
    getUnixTimestampExpiryFromNow(expiryInMins) {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + expiryInMins * 60 * 1000); // Adding 1 hour in milliseconds
        const unixTimestamp = Math.floor(futureDate.getTime() / 1000); // Convert to Unix timestamp (seconds)

        return unixTimestamp;
    },

    getUnixTimestamp30MinutesFromNow() {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + 30 * 60 * 1000); // Adding 30 minutes in milliseconds
        const unixTimestamp = Math.floor(futureDate.getTime() / 1000); // Convert to Unix timestamp (seconds)

        return unixTimestamp;
    },

    getUnixTimestamp1HourFromNow() {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + 60 * 60 * 1000); // Adding 1 hour in milliseconds
        const unixTimestamp = Math.floor(futureDate.getTime() / 1000); // Convert to Unix timestamp (seconds)

        return unixTimestamp;
    },


     getNext5Months() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const currentMonth = new Date().getMonth(); // Get the current month (0 - January, 1 - February, etc.)
        const next5Months = [];
      
        for (let i = 0; i <= 4; i++) {
          const nextMonthIndex = (currentMonth + i) % 12;
          next5Months.push(months[nextMonthIndex]);
        }
      
        return next5Months;
      }
}

