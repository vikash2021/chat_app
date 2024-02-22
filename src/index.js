
  let fetchedData = [];

  function decodeTimestamp(timestamp) {
    const date = new Date(timestamp);
    const pad = (num) => (num < 10 ? `0${num}` : num);
  
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }

  async function  fetchData() {
    const apiUrl = 'https://my-json-server.typicode.com/codebuds-fk/chat/chats';
  
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        return data;       
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  fetchedData = await fetchData();
  
  let currentSelectedContact = null;
  function handleContactSection(contactListArray = fetchedData){
    let contactList = [];
    let contactSection = document.querySelector(".scrollableContact");
    contactSection.innerHTML = null;
    contactListArray.forEach((user)=>{
      const mainContactBox = document.createElement("div");
      mainContactBox.classList.add("mainContactBox");
  
      mainContactBox.addEventListener("click",()=> {
        handleMessageSection(user.id);

        const constactInfo = document.querySelector(".messageTitleBar");
        constactInfo.innerHTML = null;

        const iconAndText = document.createElement("div");
        iconAndText.classList.add("contactInfo");


        const userImg = document.createElement('img');
        userImg.setAttribute('src', user?.imageURL);
        userImg.classList.add("userImg");
        iconAndText.appendChild(userImg);

        const userName = document.createElement("div");
        userName.classList.add("userName");
        userName.innerHTML = user?.title;
        iconAndText.appendChild(userName);

        constactInfo.append(iconAndText);
        
        })
  
      const userLogoBox = document.createElement("div");
      userLogoBox.classList.add("userLogoBox");
  
      const userDetailsBox = document.createElement("div");
      userDetailsBox.classList.add("userDetailsBox");

      const userContainer = document.createElement("div");
      userContainer.style.display="flex";
      userContainer.style.justifyContent="space-between"

      const userName = document.createElement("div");
      userName.classList.add("userName");
      userName.innerHTML = user?.title;
      userContainer.appendChild(userName);

      const latestTimeStamp = document.createElement("div");
      latestTimeStamp.classList.add("latestTimeStamp");
      latestTimeStamp.innerHTML = decodeTimestamp(user?.latestMessageTimestamp);
      userContainer.appendChild(latestTimeStamp);

      userDetailsBox.append(userContainer);

      const userOrderID = document.createElement("p");
      userOrderID.classList.add("userOrderID");
      userOrderID.innerHTML = `Order ${user?.orderId}`;
      userDetailsBox.append(userOrderID);

  
      const userLastMessage = document.createElement("p");
      userLastMessage.classList.add("userLastMessage");
      const latestMessage = user.messageList?.filter(message=>message.messageType==="text" && message.timestamp===user.latestMessageTimestamp);
      userLastMessage.innerHTML = latestMessage[0]?.message || null;
      userDetailsBox.append(userLastMessage);
  
      const userImg = document.createElement('img');
      userImg.setAttribute('src', user?.imageURL);
      userImg.classList.add("userImg");
      userLogoBox.append(userImg);
  
      mainContactBox.append(userLogoBox);
      mainContactBox.append(userDetailsBox);
      contactList.push(mainContactBox);
    })
    contactSection.append(...contactList);
  };
  
  
  function handleMessageSection(index = 1){
    currentSelectedContact = index;
    const scrollableMessage = document.querySelector(".scrollableMessage");
    const mainMessageBox = document.createElement("div");
    mainMessageBox.style.padding="20px";
    scrollableMessage.innerHTML = null;
  
    let messageArray = [];

    if(fetchedData[index-1]?.messageList?.length>0) {
      fetchedData[index-1]?.messageList.filter(message=>message.messageType!="optionedMessage").forEach((msg)=>{
        const messageText = document.createElement("div");
        messageText.classList.add("messageText");
        if(msg.sender==="USER"){
          messageText.style.marginRight = "right"; 
          messageText.style.backgroundColor="#2979ff";
          messageText.style.color="white";
        }
        messageText.innerHTML = msg?.message;
        messageArray.push(messageText);
        const breakTag = document.createElement("br");
        messageArray.push(breakTag);
      })

      fetchedData[index-1]?.messageList.filter(message=>message.messageType=="optionedMessage").forEach((msg)=>{
        const messageContainer = document.createElement("div");
        messageContainer.style.display="flex";
        messageContainer.style.flexDirection="column"

        const optionMessage = document.createElement("div");
        optionMessage.classList.add("optionMessage");
        optionMessage.innerHTML = msg?.message;
        messageContainer.appendChild(optionMessage);

        const options =msg.options;
        options.forEach((option=>{
        const optionContainer = document.createElement("div");
        optionContainer.classList.add("optionContainer");
        
        const optionText = document.createElement("div");
        optionText.classList.add("optionText");
        optionText.innerHTML = option.optionText;
        optionContainer.appendChild(optionText);

        const optionSubText = document.createElement("div");
        optionSubText.classList.add("optionSubText");
        optionSubText.innerHTML = option.optionSubText || null;
        optionContainer.appendChild(optionSubText);

        messageContainer.appendChild(optionContainer);
        messageArray.push(messageContainer);
        const breakTag = document.createElement("br");
        messageArray.push(breakTag);

      }))
      })
    }
    else {
      const messageText = document.createElement("div");
      messageText.classList.add("emptyMessageText");
      scrollableMessage.style.flexDirection="column";
      messageText.innerHTML = "Send a message to start chatting";
      messageArray.push(messageText);
    }
    mainMessageBox.append(...messageArray);
    scrollableMessage.append(mainMessageBox)
  }
  
  function handleFilter(name)
  {
    let filteredContact = fetchedData.filter((item)=>{
      if (item?.title.includes(name) || item?.orderId.includes(name))
        return item;
    })
    handleContactSection(filteredContact);
  }
  
  function handleContactFilter(){
    const inputBox = document.querySelector('.contactSearchInputBox');
    inputBox.addEventListener('keyup', (event)=>{
      handleFilter(event.target.value); 
    })
  }
  
  function handleMessageSend(){
    const inputBox = document.querySelector('.sendMessage');
    inputBox.addEventListener("keyup", (event)=>{
      if (event.key === "Enter"){
        if (event.target.value.trim() === "")
          return ;
        // message need to send
        fetchedData[currentSelectedContact-1].messageList.push({
          message: event.target.value,
          sender: "USER",
          messageType: "text"
        })
        handleMessageSection(currentSelectedContact);
        event.target.value = null;
      }
    })
  }


    
  
  handleContactSection();
  handleContactFilter();
  handleMessageSend();
  
  
  
  

  
