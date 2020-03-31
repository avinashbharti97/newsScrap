var jsdom = require('jsdom');
const {JSDOM} = jsdom;
const fs = require('fs');
const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML

var resultObj;

deepai.setApiKey('160dbac5-bdd6-40b8-8f50-0a63c580ea71');

exports.scrape =async (req, res)=>{

  let toiUrl = 'https://timesofindia.indiatimes.com/coronavirus';
  let ndtvUrl = 'https://www.ndtv.com/coronavirus';
  let indiatodayUrl = 'https://www.indiatoday.in/coronavirus-covid-19-outbreak';
  
  //let newsJson = {
    //toi: [],
    //ndtv: [],
    //indiatoday: []
  //}
  
  let newsJson = [];

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



  })

    await (async ()=>{
      //console.log('worked')
      for(let i in urlArrayToi){
        var originalNewsContent = '';
        await JSDOM.fromURL(urlArrayToi[i]).then(dom=>{
          if(dom.window.document.querySelector('._3WlLe'!= null)){
              originalNewsContent =dom.window.document.querySelector('._3WlLe').
              innerHTML.replace( /<a(\s[^>]*)?>.*?<\/a>/ig, "").
              replace(/<div(\s[^>]*)?>.*?<\/div>/ig,"").
              replace(/<br>/ig,"\n").
              replace(/<\/div>/ig, "").
                replace(/<ul(\s[^>]*)?>.*?<\/ul>/ig, "")
                  .replace(/<span(\s[^>]*)?>.*?<\/span>/ig, "");
          }
          //console.log('news content: ', originalNewsContent); 
         //contentArray.push(originalNewsContent);

        }); 
        var resp = await deepai.callStandardApi("summarization",{
          text: originalNewsContent,
        });
        //console.log('summerized content: ', resp)

        await newsJson.push({
          "title": titleArrayToi[i],
          "url": urlArrayToi[i],
          "content":resp.output,
          "source": "Times of india"
        })
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
        var originalContent = '';
        await JSDOM.fromURL(urlArrayNdtv[i]).then(dom=>{
          var originalNewsContentDom =dom.window.document.querySelector('.sp-cn').querySelectorAll('p');
          originalNewsContentDom[0].remove();
          originalNewsContentDom.forEach(dom=>{
            originalContent+=dom.textContent;
            originalContent+=" ";
          })
          //console.log('original: '+originalContent)

        }); 
        var resp = await deepai.callStandardApi("summarization",{
          text: originalContent,
        });
        //console.log('summerized content: ', resp)

        await newsJson.push({
          "title": titleArrayNdtv[i],
          "url": urlArrayNdtv[i],
          "content":resp.output,
          "source": "NDTV"
        })
      }
    })();

  //indiatody scrape
  await JSDOM.fromURL(indiatodayUrl).then(dom=>{

    let parentDom =  dom.window.document.querySelector('.view-content').childNodes;

    parentDom.forEach(node=>{
      let tempText = node.firstElementChild.nextElementSibling.firstElementChild.textContent.trim();
      let tempUrl = node.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.href;
      let tempContent = node.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.textContent;
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
        }); 
        var resp = await deepai.callStandardApi("summarization",{
          text: originalContent,
        });
        //console.log('summerized content: ', resp)

        await newsJson.push({
          "title": titleArrayIndiatimes[i],
          "url": urlArrayIndiatimes[i],
          "content":resp.output,
          "source": "India Times"
        })
      }
    })();
  resultObj = newsJson;
  const obj = await JSON.stringify(newsJson, null, 4);
  //console.log(obj)
  //exporting json file
  await fs.writeFile("news.json", obj, 'utf8', (err)=>{

    if(err){
      console.log("An error occured while saving the file");
      return console.log(err);
    }

    console.log('Json file has been exported')
  })
  
  console.log(obj)
  res.send(obj)
}


exports.getNews =async (req, res)=>{
  res.send(resultObj)
}
