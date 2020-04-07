var jsdom = require('jsdom');
var axios =  require('axios')
var moment = require('moment');
var mtz = require('moment-timezone')
const {JSDOM} = jsdom;
const fs = require('fs');
const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML

var resultObj;

deepai.setApiKey('658a2607-dbad-408d-a7a4-6e3bb75c2daa');

exports.scrape =async (req, res)=>{

  let toiUrl = 'https://timesofindia.indiatimes.com/coronavirus';
  let ndtvUrl = 'https://www.ndtv.com/coronavirus';
  let indiatodayUrl = 'https://www.indiatoday.in/coronavirus-covid-19-outbreak';
  
  //let newsJson = {
    //toi: [],
    //ndtv: [],
    //indiatoday: []
  //}
  
  let newsJson ={
    news: [],
  }

  let titleArrayToi = [];
  let urlArrayToi = [];
  let sourceArrayToi = [];
  let contentArrayToi = [];


  let titleArrayNdtv = [];
  let urlArrayNdtv = [];
  let sourceArrayNdtv = [];
  let contentArrayNdtv = [];


  let titleArrayIndiatimes = [];
  let urlArrayIndiatimes = [];
  let sourceArrayIndiatimes = [];
  let contentArrayIndiatimes  = [];

  //toi scrape
  await JSDOM.fromURL(toiUrl).then(dom=>{

    
    let parentDom =  dom.window.document.querySelector('.news-list').firstElementChild
      .nextElementSibling
      .firstElementChild
      .nextElementSibling;


    let tempDomLeftCol =parentDom 
      .firstElementChild
      .firstElementChild
      .nextElementSibling
      .childNodes;

    let tempDomRightCol = parentDom.firstElementChild
      .nextElementSibling
      .firstElementChild
      .childNodes;

    let tempDomRightBottomCol = parentDom
      .firstElementChild
      .nextElementSibling
      .firstElementChild
      .nextElementSibling
      .firstElementChild
      .childNodes;

    //titleArrayToi.push(parentDom.firstElementChild.firstElementChild.textContent);
    //let url1 =parentDom.firstElementChild.firstElementChild.firstElementChild.href;
    //urlArrayToi.push(url1);

    tempDomLeftCol.forEach(node=>{
      let tempText = node.textContent;
      let tempUrl  = node.firstElementChild.href;
      titleArrayToi.push(tempText);
      urlArrayToi.push(tempUrl);
    });

    tempDomRightCol.forEach(node=>{
      let tempText = node.textContent;
      let tempUrl = node.href;
      titleArrayToi.push(tempText);
      urlArrayToi.push(tempUrl);
    });

    tempDomRightBottomCol.forEach(node=>{
      let tempText = node.textContent;
      let tempUrl = node.firstElementChild.href;
      titleArrayToi.push(tempText);
      urlArrayToi.push(tempUrl);
    });


    //console.log(titleArray);
    //console.log(urlArray)

console.log('initial done')

  })

    await (async ()=>{
      //console.log('worked')
      for(let i in urlArrayToi){
        var originalNewsContent = '';
        var updateTime = ''; 
        try{
          await JSDOM.fromURL(urlArrayToi[i]).then(dom=>{
                originalNewsContent =dom.window.document.querySelector('._3WlLe').
                innerHTML.replace( /<a(\s[^>]*)?>.*?<\/a>/ig, "").
                replace(/<div(\s[^>]*)?>.*?<\/div>/ig,"").
                replace(/<br>/ig,"\n").
                replace(/<\/div>/ig, "").
                  replace(/<ul(\s[^>]*)?>.*?<\/ul>/ig, "")
                    .replace(/<span(\s[^>]*)?>.*?<\/span>/ig, "");
            //console.log('news content: ', originalNewsContent); 
            //contentArray.push(originalNewsContent);
            try{
              updateTime = dom.window.document.querySelector('._3Mkg-').textContent;
            }catch(e){
              console.log(e);
            }

          }); 
          console.log("toi 1 done")
        }catch(e){
          console.log(e)
        }
        try{
          var resp = await deepai.callStandardApi("summarization",{
            text: originalNewsContent,
          });
        }catch(e){
          console.log(e)
        }
        //console.log('summerized content: ', resp)
        //

        await newsJson.news.push({
          "title": titleArrayToi[i],
          "url": urlArrayToi[i],
          "content":resp.output,
          "source": "Times of india",
          "time":updateTime 
        })
        console.log("toi final")
      }
    })();

  
  //ndtv scrape
  await JSDOM.fromURL(ndtvUrl).then(dom=>{

    let parentDom =  dom.window.document.querySelector('.top-story').firstElementChild
      .nextElementSibling;
    let mainStoryText = parentDom.firstElementChild.firstElementChild.nextElementSibling.textContent.trim();
    let mainStroryUrl = parentDom.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.href;

    titleArrayNdtv.push(mainStoryText);
    urlArrayNdtv.push(mainStroryUrl);

    //console.log(mainStoryText)
    
    let listDom = parentDom.firstElementChild.nextElementSibling.childNodes;
    for(let i=0; i<6; i++){
      let tempText = listDom[i].firstElementChild.nextElementSibling.textContent.trim();
      let tempUrl = listDom[i].firstElementChild.href;
      titleArrayNdtv.push(tempText);
      urlArrayNdtv.push(tempUrl);
    }


    //for (let i in titleArrayNdtv){
      //newsJson.push({
        //"title": titleArrayNdtv[i],
        //"url": urlArrayNdtv[i],
        //"content": "NA",
        //"source": "NDTV"
      //})
    //}

    //console.log(newsJson)

  });

    await (async ()=>{
      //console.log('worked')
      for(let i in urlArrayNdtv){
        console.log('ndtv '+ i+ " in " + urlArrayNdtv[i]);
        var flag = urlArrayNdtv[i].search('www.ndtv.com');
        if(flag!=-1){
          var originalContent = '';
          var updateTime='';
          try{
            await JSDOM.fromURL(urlArrayNdtv[i]).then(dom=>{
              var originalNewsContentDom =dom.window.document.querySelector('.sp-cn').querySelectorAll('p');
              originalNewsContentDom[0].remove();
              originalNewsContentDom.forEach(dom=>{
                originalContent+=dom.textContent;
                originalContent+=" ";
              })
              //console.log('original: '+originalContent)
              try{
                updateTime = dom.window.document.querySelector('[itemprop="dateModified"]').textContent;
              }catch(e){
                console.log(e);
              }

            }); 
          }catch(e){
            console.error(e);
          }

          try{
            var resp = await deepai.callStandardApi("summarization",{
              text: originalContent,
            });
          }catch(e){
            console.error(e);
          }
          //console.log('summerized content: ', resp)

          await newsJson.news.push({
            "title": titleArrayNdtv[i],
            "url": urlArrayNdtv[i],
            "content":resp.output,
            "source": "NDTV",
            "time": updateTime
          })
          console.log("ndtv final")
        }
      }
    })();

  //indiatody scrape
  await JSDOM.fromURL(indiatodayUrl).then(dom=>{

    let parentDom =  dom.window.document.querySelector('.view-content').childNodes;

    parentDom.forEach(node=>{
      let tempText = node.firstElementChild.nextElementSibling.firstElementChild.textContent.trim();
      let tempUrl = node.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.href;
      titleArrayIndiatimes.push(tempText);
      urlArrayIndiatimes.push(tempUrl);
    })

    //for (let i in titleArrayIndiatimes){
      //newsJson.push({
        //"title": titleArrayIndiatimes[i],
        //"url": urlArrayIndiatimes[i],
        //"content": "NA",
        //"source": "India Times"
      //})
    //}

    //console.log(newsJson)

  });

    await (async ()=>{
      //console.log('worked')
      for(let i in urlArrayIndiatimes){
        var originalContent = '';
        var updateTime = '';

        try{
        await JSDOM.fromURL(urlArrayIndiatimes[i]).then(dom=>{
          var temp =dom.window.document.querySelector('.description')
          if(temp === null){
            originalContent = "NA";
          }
          else{
            var temp2 =temp.querySelectorAll('div');
            temp2.forEach(d=>{
              d.remove();
            })
            originalContent = temp.textContent.split("ALSO READ")[0];
          }
          //console.log(urlArrayIndiatimes[i], originalContent);
          try{
            updateTime = dom.window.document.querySelectorAll('.update-data')[0].textContent;
          }catch(e){
            console.log(e);
          }
        }); 
        var resp = await deepai.callStandardApi("summarization",{
          text: originalContent,
        });
        }catch(e){
          console.log(e)
        }
        //console.log('summerized content: ', resp)

        await newsJson.news.push({
          "title": titleArrayIndiatimes[i],
          "url": urlArrayIndiatimes[i],
          "content":resp.output,
          "source": "India Today",
          "time": updateTime
        })
      }
    })();


  //await(()=>{
    //var today = new Date();
    //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //var dateTime = date+' '+time;
    //newsJson.time = dateTime.toLocaleString();
    
    
  //})();
  newsJson.time = moment().utcOffset("+05:30").calendar();
  const obj = await JSON.stringify(newsJson, null, 4);
  resultObj = newsJson;
  //console.log(obj)
  //exporting json file
  //making a post request to restdb.io
  const options = {
    headers:{
      'x-apikey': '58e92897164a893a31a9c6ea6a817a1cfe973',
      'Content-type': 'application/json'
    }
  } 

  axios.put('https://covidnews-45ef.restdb.io/rest/news/5e8be8c75053da750001d448', obj, options)
    .then((res)=>{
      console.log('put successful: '+res);
    },
      (error)=>{
        console.log(error);
      } 
    )


  await fs.writeFile('news.json', obj, 'utf8', (err)=>{

    if(err){
      console.log("An error occured while saving the file");
      return console.log(err);
    }

    console.log('Json file has been exported')
  })
  
  console.log(resultObj)
  res.json(resultObj)
}


exports.getNews =async (req, res)=>{
  res.json(resultObj)
}
