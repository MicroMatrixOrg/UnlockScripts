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
                    const blocks = splitCode(msgText)
                    console.log(blocks)
                    for(let i = 0; i < blocks.length; i++){
                        // sleep(500).then(() => {
                        //     s.reply(blocks[i]);
                        // })
                        s.listen(100);
                        s.reply(blocks[i]);
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

function splitCode(code) {
  // Split the code into an array of individual lines
  let lines = ''
  
  if(code.includes('}')){
      lines = code.split('}')
  }else{
      lines = code.split(/[.!]/)
  }
  console.log("lines",lines)
  // Initialize the blocks array and currentBlock string
  const blocks = [];
  let currentBlock = '';

  // Iterate over the lines of code
  for (const line of lines) {
    // Check if the current line can be added to the current block
    if (currentBlock.length + line.length <= 199) {
      // If it can, append the line to the current block
      currentBlock += line;
    } else {
      // If it cannot, add the current block to the blocks array and
      // reset the current block to the current line
      if(code.includes('}')){
        blocks.push(currentBlock + "}");
      }else{
          blocks.push(currentBlock);
      }
      currentBlock = line;
    }
  }

  // After iterating over all lines, add the current block to the blocks array
  blocks.push(currentBlock);

  // Return the blocks array
  return blocks;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


main()
