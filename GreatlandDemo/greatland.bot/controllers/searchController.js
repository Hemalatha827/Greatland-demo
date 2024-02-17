const GLOBAL = require('../GLOBAL_VARS.json');
const queryBuilderUtils = require('../utilities/zincQueryBuilder');
const utilitieFunc = require('../utilities/utilitieFunc');
const searchLocationService = require('../service/search/searchLocationService');
const propertyDetailsService = require('../service/search/propertyDetailsService');



exports.searchlocation = async (req, res) => {

  var postData =req.body;

  var PAGE_START = Number(postData.start);
  const channel = postData.channel;
  let sortFields = [];
  postData["data"].forEach(function (e) {
    if (e.query !== '-') {
      sortFields.push(e.query);
    }
  });



  const elasticData = await queryBuilderUtils.getElasticData(PAGE_START, GLOBAL.SEARCH.MAX_PAGE_SIZE, postData.data,GLOBAL.SERVER.ZS_PROPERTIES_INDEX, [], sortFields);

    const data = elasticData.hits.hits;
    let dataTotalCount = Number(elasticData.hits.total.value);

  
  
    let options = [];
    if (postData["search-type"] == 'quick') {
      const optionsData = await queryBuilderUtils.getElasticData(0, 1, [], GLOBAL.SERVER.ZS_QUICK_REPLIES_INDEX, [], []);


      const searchCat = postData["category"] || "📍Location";
      options = optionsData.hits.hits[0]._source[searchCat]["1"];
      //Remove 'Restart Search' at the last index and only display 10 values
      options.pop();
      options.splice(options.indexOf("More Options⏩", 1));
      options.splice(options.indexOf(postData.data["0"]["value"]), 1);
    }
  
    const queryCat = postData["data"][0]["query"] != "-" ? postData["data"][0]["query"] : "Location";
    const queryType = postData["data"][0]["query"] != "-" ? postData["data"][0]["type"] : "term";
  
    let message = searchLocationService.dynamicSearchMessage(data, PAGE_START, dataTotalCount, options, queryCat, queryType, channel);
  
    let dynamicContent = {
      "messages": message
    };
  
    res.json(dynamicContent);
  
};

exports.propertydetails =async(req, res) => {

  var postData =req.body;

  var PAGE_START = Number(postData.start);
  let sortFields = [];
  postData["data"].forEach(function (e) {
    if (e.query !== '-') {
      sortFields.push(e.query);
    }
  });

  const elasticData = await queryBuilderUtils.getElasticData(PAGE_START, GLOBAL.SEARCH.MAX_PAGE_SIZE, postData.data, GLOBAL.SERVER.ZS_PROPERTIES_INDEX, [], sortFields);
  const data = elasticData.hits.hits;
  
  let message = propertyDetailsService.dynamicPropertyDetMessage(data);

  let dynamicContent = {
    "messages": message
  };

  res.json(dynamicContent);



};



