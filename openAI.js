/*
* @author https://t.me/sillyGirl_Plugin
 * @version v1.0.0
 * @origin 
* @version v1.0.3
* @create_at 2022-09-08 15:06:22
* @description openAI人工智障，需设置token
* @title openAI
* @rule ai ?
 * @public false
*/

//请在openAI官网登陆完成后，点击右上角头像-View API keys创建token，并使用命令'set otto openAI_token ?'设置token

const s=sender

function main(){
    let token=(new Bucket("otto").get("openAI_token"))
    if(!token){
        s.reply("请使用命令'set otto openAI_token ?'设置openAI的token")
        return
    }
    let text=s.param(1)
    if(text.match(/(\u753b|\u6765)(\u5f20|\u4e2a)\S+\u56fe?/)){
        let data=ImageGenerations(token,{
            "prompt": text,
            "n": 1,
            "size": "512x512"
        })
        try{
            s.reply(image(data.data[0].url))
        }
        catch(err){
            s.reply("未知错误:\n"+JSON.stringify(data))
        }
    }
    else
        Talk(token,text)
}




function Talk(token,text){
    let limit=50
    while(limit-->0){
        let tipid=s.reply("请稍后..")
        let data=Completions(token,{
            "model": "text-davinci-003", 
            "prompt": text,
            "temperature": 0, 
            "max_tokens": 1024
        })
        s.recallMessage(tipid)
        // console.log(JSON.stringify(data))
        if(!data){
            s.reply("网络错误")
            break
        }else{
            if(data.error){
                s.reply(data.error.message)
                break
            }else{
                try{
                    let msgText = data.choices[0].text;
                    console.log(msgText)
                    let blocks = splitParagraph(msgText);
                    for(let i = 0; i < blocks.length; i++){
                        s.listen(100);
                        let lastCharIndex = lastEnChar(blocks[i]);
                                 
                        if(lastCharIndex > 0){                  
                          s.reply(blocks[i].substring(0,lastCharIndex));
                        }else{
                          console.log(blocks[i].length,lastCharIndex)
                          s.reply(blocks[i]);
                        }
                        
                    }
                }
                catch(err){
                    s.reply("未知错误\n"+JSON.stringify(data))
                }
            }
        }
        let next=s.listen(60*1000)
        if(!next || next.getContent()=="q"){
            s.reply("退出对话")
            break
        }
        else
            text=next.getContent()
    }
}

/*************
 {
  "prompt": string（描述提示）,
  "n": 图片生成数量,
  "size": 图片尺寸('256x256', '512x512', '1024x1024')
}
 *************/
function ImageGenerations(token,body){
	try{
		let data=request({
			url:"https://api.openai.com/v1/images/generations",
			method:"post",
			headers:{
				accept: "application/json",
				Authorization:"Bearer "+token
			},
            body:body
		})
		return JSON.parse(data.body)
	}
	catch(err){
		return null
	}
}



/**
 * body={
 *      model:使用模型,
 *      prompt:ai提示，无此项则开启新会话
 *      ...
 * }
 */

function Completions(token,body){
	try{
		let data=request({
			url:"https://api.openai.com/v1/completions",
			method:"post",
			headers:{
				accept: "application/json",
				Authorization:"Bearer "+token
			},
            body:body
		})
		return JSON.parse(data.body)
	}
	catch(err){
		return null
	}
}

function GetModels(token){
	try{
		let data=request({
			url:"https://api.openai.com/v1/models",
			method:"get",
			headers:{
				accept: "application/json",
				Authorization:"Bearer "+token
			}
		})
		return JSON.parse(data.body)
	}
	catch(err){
		return null
	}
}

// function splitCode(code) {
//   // Define a regular expression that matches any of the specified delimiters
//   const regex = new RegExp(`[.!;}]|\\b`, 'g');
//   // Split the code into an array of individual lines
//   let lines = code.split(regex);

//   // Initialize the blocks array and currentBlock string
//   const blocks = [];
//   let currentBlock = '';

//   // Iterate over the lines of code
//   for (const line of lines) {
//     // Check if the current line can be added to the current block
//     if (currentBlock.length + line.length <= 160) {
//       // If it can, append the line to the current block
//       currentBlock += line;
//     } else {
//       // If it cannot, add the current block to the blocks array and
//       // reset the current block to the current line
//       blocks.push(currentBlock + line[line.length - 1]);
//       currentBlock = line;
//     }
//   }

//   // After iterating over all lines, add the current block to the blocks array
//   blocks.push(currentBlock);
//   // Return the blocks array
//   return blocks;
// }

function splitParagraph(code) {
  // Define a parser function that checks the syntax of a statement
  const parser = (code) => {
    // Parse the code and check the syntax of the statement
    // Return true if the statement is valid, false otherwise
  };

    const regex = new RegExp(`([.!;}]|\\b)`, 'g');
  // Split the code into an array of individual lines
  let lines = code.split(regex);

  // Initialize the blocks array and currentBlock string
  const blocks = [];
  let currentBlock = '';

  // Iterate over the lines of code
  for (const line of lines) {
    // Check if the current line can be added to the current block
    if (currentBlock.length + line.length <= 170) {
      // If it can, append the line to the current block
      currentBlock += line;
      // Set the merge flag to true
      merge = true;
    } else {
      // If it cannot, add the current block to the blocks array and
      // reset the current block to the current line
      blocks.push({ text: currentBlock + line[line.length - 1], merge: merge });
      currentBlock = line;
      // Set the merge flag to false
      merge = false;
    }
  }

  // After iterating over all lines, add the current block to the blocks array
  blocks.push({ text: currentBlock, merge: merge });

  // Initialize the result array
  const result = [];
  // Iterate over the blocks
  for (let i = 0; i < blocks.length; i++) {
    // If the current block is a valid statement,
    // append it to the previous block
    if (parser(blocks[i].text)) {
      result[result.length - 1].text += blocks[i].text;
    } else {
      // Otherwise, add the current block to the result array
      result.push(blocks[i]);
    }
  }

  // Return the result array
  return result.map(block => block.text);
}

function lastEnChar(str) {
  var regex = /[a-zA-Z]/g;
  var matches = str.match(regex);
  if (matches) {
    var lastMatch = matches[matches.length - 1];
    var lastMatchIndex = str.lastIndexOf(lastMatch);
    var lastSpecialCharIndex = -1;
    for (var i = lastMatchIndex - 1; i >= 0; i--) {
      if (/[\s\n\r]/.test(str[i])) {
        lastSpecialCharIndex = i;
        break;
      }
    }
    var lastCharIndex = lastMatchIndex;
    if (lastSpecialCharIndex > lastMatchIndex) {
      // The last match is after a special character
      lastCharIndex -= (lastSpecialCharIndex + 1);
    }
    // Check if there is any text after the last match
    if (lastMatchIndex + lastMatch.length < str.length) {
      return -1;
    }
    return lastCharIndex;
  } else {
    return -1;
  }
}

main()
