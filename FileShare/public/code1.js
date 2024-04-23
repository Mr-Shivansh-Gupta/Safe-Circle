const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input"),
  progressArea = document.querySelector(".progress-area"),
  uploadedArea = document.querySelector(".uploaded-area");

// form click event
form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  let file = target.files[0]; //getting file [0] this means if user has selected multiple files then get first one only
  if (file) {
    let fileName = file.name; //getting file name
    if (fileName.length >= 12) { //if file name length is greater than 12 then split it and add ...
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    //uploadFile(fileName); //calling uploadFile with passing file name as an argument
  }
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




  document.querySelector("#file-input").addEventListener("change", function (e) {
    let file = e.target.files[0];
    // console.log(e);
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
    reader.onload = function (e) {
      let buffer = new Uint8Array(reader.result);
      let el = document.createElement("div");
      el.classList.add("item");
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
      }, buffer, el.querySelector(".progress"));
      // console.log(buffer);
      // console.log(el);
      // console.log(buffer.length);
      // console.log(shareFile);
      // console.log(buffer_size);
    }
    reader.readAsArrayBuffer(file);
  });


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

  function shareFile(metadata, buffer, progress_node) {
    socket.emit("file-meta", {
      uid: receiverID,
      metadata: metadata
    });
    socket.on("fs-share", function () {
      let chunk = buffer.slice(0, metadata.buffer_size);
      buffer = buffer.slice(metadata.buffer_size, buffer.length);
      progress_node.innerText = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100) + "%";
      let per = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100);
      const ele = document.querySelector('.pn');
      document.getElementById('pn').innerHTML = " <div class='progress' style='width:"+per+"%'></div>";
      // let per = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100);
      // console.log(progress_node);
      // console.log(chunk);
      // console.log(buffer);
      // console.log(buffer.slice(metadata.buffer_size, buffer.length));

      if (chunk.length != 0) {
        socket.emit("file-raw", {
          uid: receiverID,
          buffer: chunk
        });
      }
    });
  }


})();