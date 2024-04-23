const form = document.querySelector("form");
const fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");
  var glob;
  var glob2;
  var glob_name;
  var glob_fs;
  var glob_fss;
  var m = {};



 

// form click event
form.addEventListener("click", () => {
  fileInput.click();
});

let fs = fileInput.onchange = ({ target }) => {
  let file = target.files[0]; //getting file [0] this means if user has selected multiple files then get first one only
  console.log(file);
  // if (file) {
  //   let fileName = file.name; //getting file name
  //   if (fileName.length >= 12) { //if file name length is greater than 12 then split it and add ...
  //     let splitName = fileName.split('.');
  //     fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
  //   }
  //   //uploadFile(fileName); //calling uploadFile with passing file name as an argument
  // }
};

function copyText() {
      
  /* Copy text into clipboard */
  navigator.clipboard.writeText
      ("http://localhost:5000/receiver");
      document.getElementById("btn1").innerText = 'Copied';
}

(function () {
  let receiverID;
  const socket = io();
  function generateID() {
    return `${Math.trunc(Math.random() * 999)} -${Math.trunc(Math.random() * 999)} -${Math.trunc(Math.random() * 999)}`;
  }
  document.querySelector("#sender-start-con-btn").addEventListener("click", function () {
    let joinID = generateID();
    document.querySelector("#join-id").innerHTML = `
                <b>Room ID </b>
                <span>${joinID}</span> 
                <p>Share link to receiver...</p>
                <span><a href="http://localhost:5000/receiver" target="_blank" class="link">http://localhost:5000/receiver</a></span>
                <!-- HTML !-->
                <button class="button-7" role="button" onclick = "copyText()" id="btn1">Copy Link</button>
                `;
    socket.emit("sender-join", {
      uid: joinID
    });
  });

  socket.on("init", function (uid) {
    receiverID = uid;
    document.querySelector(".join-screen").classList.remove("active");
    document.querySelector(".fs-screen").classList.add("active");
  });


  document.querySelector("#file-input").addEventListener("change", (e) => {
    let file = e.target.files[0];
    let fs = e.target.files[0].size;
    
    fs = glob_fs;
     console.log(e);
  
      if (!file) {
          return;
        }
        let fileName = file.name; //getting file name
        if (fileName.length >= 12) { //if file name length is greater than 12 then split it and add ...
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        //console.log(fileName);
        let reader = new FileReader();
        reader.onload = (e) => {
            let buffer = new Uint8Array(reader.result);
            shareFile2({
              filename: file.name,
              total_buffer_size: buffer.length,
              buffer_size: 1024
             
            }, buffer);
            console.log(buffer);
            let el = document.createElement("div");
            el.classList.add("item");
            // shareFile();
        
      el.innerHTML = `<li class="row">
              <i class="fas fa-file-alt"></i>
              <div class="content">
                <div class="details" >
                  <div class="filename">${fileName} • Uploading</div>
                  <div class="progress" id="source"></div>
                </div>
                <div class='progress-bar' id = 'pn'>
                
                </div>
              </div>
              </li>`;
              
          
          

      // document.getElementById("result").innerHTML = html;
      // document.querySelector(".files-list").appendChild(el);
      document.querySelector(".progress-area").appendChild(el);
      shareFile({
        filename: file.name,
        total_buffer_size: buffer.length,
        buffer_size: 1024
       
      }, buffer, el.querySelector(".progress"),document.querySelector(".progress-bar")
      );
      console.log(m.po);
      if (m.po == 100) {
        progressArea.innerHTML = "";
        const uploadedHTML = `<li class="row">
                                <div class="content upload">
                                  <i class="fas fa-file-alt"></i>
                                  <div class="details">
                                    <span class="name">${glob_name} • Uploaded</span>
                                    <span class="size">${glob_fs}</span>
                                  </div>
                                </div>
                                <i class="fas fa-check"></i>
                              </li>`;
        uploadedArea.classList.remove("onprogress");
        // uploadedArea.innerHTML = uploadedHTML; //uncomment this line if you don't want to show upload history
        uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML); //remove this line if you don't want to show upload history
      }
      // console.log(buffer);
      // console.log(el);
       console.log(buffer.length);
      // console.log(shareFile);
      // console.log(buffer_size);
    } 
    //console.log(document.getElementById("source").innerHTML);
    reader.readAsArrayBuffer(file);
    //console.log(readAsArrayBuffer(file));
    
  });



  function shareFile(metadata, buffer, progress_node,wd,po) {
    socket.emit("file-meta", {
      uid: receiverID,
      metadata: metadata
    });
    socket.on("fs-share", () => {
      let chunk = buffer.slice(0, metadata.buffer_size);
      buffer = buffer.slice(metadata.buffer_size, buffer.length);
      progress_node.innerText = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100) + "%";
      //let per = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100);
      glob = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100);
     
      function a (){
      glob_fss = glob;
    } 
      //up();
      //shareFile.up=up;
      //up();
      //console.log(metadata.total_buffer_size);
      //console.log(buffer.length);
      wd.innerHTML =  "<div class='progress' style='width:"+glob+"%'></div>";
      // window.onload = ele = document.querySelector('.pn');
      // ele.innerHTML = " <div class='progress' style='width:"+per+"%'></div>";
     //document.getElementsByClass('pn').innerHTML = "<div class='progress' style='width:"+per+"%'></div>";
      // let per = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100);
      // console.log(progress_node);
      // console.log(chunk);
      // console.log(buffer);
      // console.log(buffer.slice(metadata.buffer_size, buffer.length));
     // console.log(document.getElementById("source").innerHTML);
      if (chunk.length != 0) {
        socket.emit("file-raw", {
          uid: receiverID,
          buffer: chunk
        });
      }
    });
 // chn();
  }

  function shareFile2(metadata,buffer) {
    socket.emit("file-meta", {
      metadata: metadata
    });
    glob2 = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100);
    m.po = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100);

  }

  


  // var str,
  // element = document.getElementById('source');
  // if (element != null) {
  //     str = element.value;
  // }
  // else {
  //     str = null;
  //     console.log("not found")
  // }


  // document.getElementById("fource")
  // .innerHTML ="<div class='progress-bar'>"+
  // "<div class='progress' style='width:${html}%'>"+ 
  // "</div>"+
  // "</div>";

  
// function chn () {
  

//   uploadedArea.classList.add("onprogress");
//   progressArea.innerHTML =  `<li class="row">
//   <i class="fas fa-file-alt"></i>
//   <div class="content">
//     <div class="details" >
//       <div class="filename">${glob_name} • Uploading</div>
//       <div class="progress" id="source"></div>
//     </div>
//     <div class='progress-bar'>
    
//     </div>
//   </div>
//   </li>`;

//   //shareFile.up();
// // function up (){
// // let pp = glob;
// console.log(glob);
// if (glob == 100) {
//   progressArea.innerHTML = "";
//   const uploadedHTML = `<li class="row">
//                           <div class="content upload">
//                             <i class="fas fa-file-alt"></i>
//                             <div class="details">
//                               <span class="name">${glob_name} • Uploaded</span>
//                               <span class="size">${glob_fs}</span>
//                             </div>
//                           </div>
//                           <i class="fas fa-check"></i>
//                         </li>`;
//   uploadedArea.classList.remove("onprogress");
//   // uploadedArea.innerHTML = uploadedHTML; //uncomment this line if you don't want to show upload history
//   uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML); //remove this line if you don't want to show upload history
// }}

})();