var jsdom = require('jsdom');
const {JSDOM} = jsdom;
const fs = require('fs');

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

  //toi scrape
  await JSDOM.fromURL(toiUrl).then(dom=>{

    let titleArray = [];
    let urlArray = [];
    let sourceArray = [];
    
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

    titleArray.push(parentDom.firstElementChild.firstElementChild.textContent);
    urlArray.push(parentDom.firstElementChild.firstElementChild.firstElementChild.href);

    tempDomLeftCol.forEach(node=>{
      let tempText = node.textContent;
      let tempUrl  = node.firstElementChild.href;
      titleArray.push(tempText);
      urlArray.push(tempUrl);
    });

    tempDomRightCol.forEach(node=>{
      let tempText = node.textContent;
      let tempUrl = node.href;
      titleArray.push(tempText);
      urlArray.push(tempUrl);
    });

    tempDomRightBottomCol.forEach(node=>{
      let tempText = node.textContent;
      let tempUrl = node.firstElementChild.href;
      titleArray.push(tempText);
      urlArray.push(tempUrl);
    })


    //console.log(titleArray);
    //console.log(urlArray)

    for (let i in titleArray){
      newsJson.push({
        "title": titleArray[i],
        "url": urlArray[i],
        "content": "NA",
        "source": "Times of india"
      })
    }

    //console.log(newsJson)

    //titleArray.map((title)=>{
      //newsJson.toi.push({
       //"title": title
     //})
    //})

    //urlArray.map((url)=>{
      //newsJson.toi.push({
       //"url": url 
     //})
    //})

  })

  
  //ndtv scrape
  await JSDOM.fromURL(ndtvUrl).then(dom=>{

    let titleArray = [];
    let urlArray = [];

    let parentDom =  dom.window.document.querySelector('.top-story').firstElementChild
      .nextElementSibling;
    let mainStoryText = parentDom.firstElementChild.firstElementChild.nextElementSibling.textContent.trim();
    let mainStroryUrl = parentDom.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.href;

    titleArray.push(mainStoryText);
    urlArray.push(mainStroryUrl);

    //console.log(mainStoryText)
    
    let listDom = parentDom.firstElementChild.nextElementSibling.childNodes;
    for(let i=0; i<6; i++){
      let tempText = listDom[i].firstElementChild.nextElementSibling.textContent.trim();
      let tempUrl = listDom[i].firstElementChild.href;
      titleArray.push(tempText);
      urlArray.push(tempUrl);
    }

    //listDom.forEach(node=>{
      //console.log(node.firstElementChild.nextElementSibling.textContent.trim())
      //let tempText = node.firstElementChild.nextElementSibling.textContent.trim();
      //let tempUrl = node.firstElementChild.href;
      //titleArray.push(tempText);
      //urlArray.push(tempUrl);
    //})

    for (let i in titleArray){
      newsJson.push({
        "title": titleArray[i],
        "url": urlArray[i],
        "content": "NA",
        "source": "NDTV"
      })
    }

    //console.log(newsJson)

  });


  //indiatody scrape
  await JSDOM.fromURL(indiatodayUrl).then(dom=>{

    let titleArray = [];
    let urlArray = [];
    let shortContentArray = [];

    let parentDom =  dom.window.document.querySelector('.view-content').childNodes;

    //for(let i=0; i<6; i++){
      //let tempText = listDom[i].firstElementChild.nextElementSibling.textContent.trim();
      //let tempUrl = listDom[i].firstElementChild.href;
      //titleArray.push(tempText);
      //urlArray.push(tempUrl);
    //}

    parentDom.forEach(node=>{
      let tempText = node.firstElementChild.nextElementSibling.firstElementChild.textContent.trim();
      let tempUrl = node.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.href;
      let tempContent = node.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.textContent;
      titleArray.push(tempText);
      urlArray.push(tempUrl);
      shortContentArray.push(tempContent);
    })

    for (let i in titleArray){
      newsJson.push({
        "title": titleArray[i],
        "url": urlArray[i],
        "content": shortContentArray[i],
        "source": "India Times"
      })
    }

    //console.log(newsJson)

  })
  const obj = JSON.stringify(newsJson, null, 4);
  console.log(obj)
  //exporting json file
  fs.writeFile("news.json", obj, 'utf8', (err)=>{

    if(err){
      console.log("An error occured while saving the file");
      return console.log(err);
    }

    console.log('Json file has been exported')
  })
  
  //console.log(obj)
  res.send('success');
}
