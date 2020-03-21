var jsdom = require('jsdom');
const {JSDOM} = jsdom;

exports.scrape = (req, res)=>{

  let toiUrl = 'https://timesofindia.indiatimes.com/coronavirus';
  let ndtvUrl = 'https://www.ndtv.com/coronavirus';
  let indiatodayUrl = 'https://www.indiatoday.in/coronavirus-covid-19-outbreak';
  
  let newsJson = {
    toi: []
  }

  JSDOM.fromURL(toiUrl).then(dom=>{

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
      newsJson.toi.push({
        "title": titleArray[i],
        "url": urlArray[i]
      })
    }

    console.log(newsJson)

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
}
