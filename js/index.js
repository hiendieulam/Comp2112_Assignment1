var emails = []; // Declare the email array
var emailsRead=[]; // Declare the email array read
var emailsDeleted=[]; // Declare the email array deleted
var emailsSent=[]; // Declare the email array sent

fetch('https://my.api.mockaroo.com/email2.json?key=fed58100&rows=3')
.then (function(response){
  return response.json();
})
.then(function(myJson){
  emails.push(...myJson);
  emailsRead.push(...myJson);  // Push current email into mail list
  render();
});

// Function mark the email unread
function NewsEmail(item){
  if (!emailsRead.includes(item)){
    return 'email-item-unread';
  }
}

// Function count emails unread in inbox
function ReanderCountUnRead(){
  var unRead = emails.filter(e => !emailsRead.includes(e)); 
  var countUnRead=document.querySelector('.email-count');      
   countUnRead.innerHTML=`(${unRead.length})`; 
  
}

//Function display the email list in inbox
function render(){
  ReanderCountUnRead();  
  const bodyemail = document.querySelector('#list');  
  const snippet = emails.map((email,idx) => `   
     		<div id=article_${idx} class="email-item ${NewsEmail(email)} pure-g" data-idx=${idx}>
            <div class="pure-u">
                <img width="64" height="64" alt="${email.name}" class="email-avatar" src="${email.pic}">
            </div>
            <div class="pure-u-3-4">
                <h5 class="email-name">${email.name} ${email.date}</h5>
                <h4 class="email-subject">${email.subject}</h4>
                <p class="email-desc">
                    ${email.body}
                </p>
            </div>
        </div>        

  `).join('');
  
  list.innerHTML = snippet;
  RenderClickItemEmail();

};

//Funtion display Email content when has event
function RenderClickItemEmail(){
  subject= Array.from(document.querySelectorAll('.email-item'));
  subject.map(btn => {
    btn.addEventListener('click', function(event) {
      event.preventDefault();
	  
	  // Delete all class attributes selected
      var item = document.querySelectorAll('.email-item-selected');
      for (i = 0; i < item.length; i++){
        item[i].classList.remove('email-item-selected');
      }
	  
	  // Save to the read mail list
      if (!emailsRead.includes(emails[this.dataset.idx])){
         emailsRead.unshift(emails[this.dataset.idx]);
         ReanderCountUnRead(); 
      }
	  
	  // Set the selected email attribute
      var view = document.querySelector(`#article_${this.dataset.idx}`);
	  if(view){
        view.setAttribute('class','email-item pure-g email-item-selected');
	  }
      
      // Display the email content in inbox
      if (document.querySelector('.email-inbox.menu-selected')) {
        const main = document.querySelector('.email-content');
              main.innerHTML = `
              <div class="email-content-header email-inbox pure-g">
                <div class="pure-u-1-2">
                    <h1 class="email-content-title">${emails[this.dataset.idx].subject }</h1>
                    <p class="email-content-subtitle">
                        From <a>${emails[this.dataset.idx].name } </a> at <span>${emails[this.dataset.idx].date}</span>
                    </p>
                </div>

                <div class="email-content-controls pure-u-1-2">
                  <button id="delete" class="secondary-button pure-button">Delete</button>
                  <button id="archive" class="secondary-button pure-button">Archive</button>
                  <button id="unread"class="secondary-button pure-button">Unread</button>
                </div>
              </div>

              <div class="email-content-body">
                <p>${emails[this.dataset.idx].body}</p>

                <p>
                  Regards,<br>
                  ${emails[this.dataset.idx].name }
                </p>
              </div>
          </div>
              `;
      }else       
      // Display the email content in Sent 
      if (document.querySelector('.email-sent.menu-selected')) {
        const main = document.querySelector('.email-content');
              main.innerHTML = `
              <div class="email-content-header email-sent pure-g">
                <div class="pure-u-1-2">
                    <h1 class="email-content-title">${emailsSent[this.dataset.idx].subject }</h1>
                    <p class="email-content-subtitle">
                        From <a>${emailsSent[this.dataset.idx].name } </a> at <span>${emailsSent[this.dataset.idx].date}</span>
                    </p>
                </div>

                <div class="email-content-controls pure-u-1-2">
                  <button id="delete" class="secondary-button pure-button">Delete</button>
                  <button id="archive" class="secondary-button pure-button">Archive</button>                  
                </div>
              </div>

              <div class="email-content-body">
                <p>${emailsSent[this.dataset.idx].body}</p>

                <p>
                  Regards,<br>
                  ${emailsSent[this.dataset.idx].name }
                </p>
              </div>
          </div>
              `;
      }else       
      // Display the email content in Trash
      if (document.querySelector('.email-trash.menu-selected')) {
        const main = document.querySelector('.email-content');
              main.innerHTML = `
              <div class="email-content-header email-sent pure-g">
                <div class="pure-u-1-2">
                    <h1 class="email-content-title">${emailsDeleted[this.dataset.idx].subject }</h1>
                    <p class="email-content-subtitle">
                        From <a>${emailsDeleted[this.dataset.idx].name } </a> at <span>${emailsDeleted[this.dataset.idx].date}</span>
                    </p>
                </div>

                <div class="email-content-controls pure-u-1-2">
                  <button id="delete" class="secondary-button pure-button">Deleted</button>                  
                  <button id="undodelete"class="secondary-button pure-button">Undo Delete</button>
                </div>
              </div>

              <div class="email-content-body">
                <p>${emailsDeleted[this.dataset.idx].body}</p>

                <p>
                  Regards,<br>
                  ${emailsDeleted[this.dataset.idx].name }
                </p>
              </div>
          </div>
              `;
      }                      
      // Creates a delete command
      var deleteBtn = document.querySelector('#delete');
      if(deleteBtn){
        deleteBtn.addEventListener('click', (e) => {
          e.preventDefault();
            if (confirm(`Do you want to delete?`)) {       
              // Delete in Inbox
              if (document.querySelector('.email-inbox.menu-selected')) {     
                emailsDeleted.unshift(emails[this.dataset.idx]);            
                delete emails[this.dataset.idx];
                main.innerHTML='<div class="email-content"></div>';
                render();      
              }else //Delete in Sent
              if (document.querySelector('.email-sent.menu-selected')) {     
                emailsDeleted.unshift(emailsSent[this.dataset.idx]);           
                delete emailsSent[this.dataset.idx];
                main.innerHTML='<div class="email-content"></div>';
                //render();  
                var emailsent = document.querySelector('.email-sent');
                emailsent.click();                    
              }else // Delete in Trash
              if (document.querySelector('.email-trash.menu-selected')) { 
                delete emailsDeleted[this.dataset.idx];
                main.innerHTML='<div class="email-content"></div>';
                var emailTrash = document.querySelector('.email-trash');
                emailTrash.click();                  
              //document.querySelector('#delete').innerHTML='Delete';
              }              
            }          
        });  
      }

      // Creates a Unread command      
      var unreadBtn = document.querySelector('#unread');
      if(unreadBtn){
        unreadBtn.addEventListener('click', (e) => {
        e.preventDefault();          
            //Unread in Inbox
            if (document.querySelector('.email-content-header.email-inbox')) {                  
              var index = emailsRead.indexOf(emails[this.dataset.idx]);              
              delete emailsRead[index];              
              render();      
            }              
          });   
      }
      // Creates a Undodelete command           
      var undodeleteBtn = document.querySelector('#undodelete');
      if(undodeleteBtn){
          undodeleteBtn.addEventListener('click', (e) => {
          e.preventDefault();                                                  
          emails.unshift(emailsDeleted[this.dataset.idx]);
          delete emailsDeleted[this.dataset.idx];                              
          main.innerHTML='<div class="email-content"></div>';
          var emailTrash = document.querySelector('.email-trash');
          emailTrash.click();
        }); 
        }
      });    
    });  
  }
    
// Creates a event when push Compose Button, fill the new email form          
var composeBtn = document.querySelector('#compose');
composeBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const news = document.querySelector('.email-content');
  news.innerHTML =`  
    <form class="newform" name="new_email">
      <div class="field">
        <div class="row" class="control has-icons-left has-icons-right">
          <div class="col-lg-6 ">
            <label class="lblname">Name</label>
            <input class="inputname" type="text" placeholder="Name input" id="name" name="name">
          </div>
        </div>
      </div>

      <div class="field">
        <div class="row" class="control has-icons-left has-icons-right">
          <label class="lblemail">Email</label>
          <input class="inputemail" type="email" placeholder="Email input"  name="email_address">
        </div>
      </div>

      <div class="field">
        <div class="row" class="control has-icons-left has-icons-right">
          <div class="col-lg-6 ">
            <label class="lblsubject">Subject</label>
            <input class="inputsubject" type="text" placeholder="Subject input" name="subject">
          </div>
        </div>
      </div>

      <div class="field">
        <div class="row" class="pl3-ns order-1 order-2-ns mb4 mb0-ns w-100 w-40-ns">
          <div class="col-lg-6 ">
            <label  class="lblavatar">Avatar</label>
            <img src="" class="db">
          </div>
        </div>
      </div>

      <div class="field">
        <div class="row" class="control">
          <label class="lblmessage">Message</label>
          <textarea class="textarea" placeholder="Textarea" name="msg" id="msg"></textarea>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button id="submit"class="button is-link">Submit</button>
        </div>
      </div>
    </form>
  `;

  // Handle event when click Submit
  const submit = document.querySelector('#submit');
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    var day=`${dd}/${mm}/${yyyy}`;    
    const newEmail = {
      name: document.forms.new_email.name.value,
      pic: 'https://avatars1.githubusercontent.com/u/33965647?v=4',
      email: document.forms.new_email.email_address.value,
      subject: document.forms.new_email.subject.value,
      body: document.forms.new_email.msg.value,
      user: 'hi',
      date: day,
      time: today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
    };
    document.forms.new_email.name.value='';
    document.forms.new_email.email_address.value='';
    document.forms.new_email.subject.value='';
    document.forms.new_email.msg.value='';

    emails.unshift(newEmail);
    emailsSent.unshift(newEmail);
    render();
  })
});

// Handle event when click email inbox class
var emailInbox = document.querySelector('.email-inbox');
emailInbox.addEventListener('click', (e) => {
  e.preventDefault();

  // Delete all attribute in class selected
  var item = document.querySelectorAll('.menu-selected');
  for (i = 0; i < item.length; i++){
    item[i].classList.remove('menu-selected');
  }
  emailInbox.classList.add('menu-selected');  
  const bodyemail = document.querySelector('#list');  
  const snippet = emails.map((email,idx) => `   
     		<div id=article_${idx} class="email-item ${NewsEmail(email)} pure-g" data-idx=${idx}>
            <div class="pure-u">
                <img width="64" height="64" alt="${email.subject}" class="email-avatar" src="${email.pic}">
            </div>
            <div class="pure-u-3-4">
                <h5 class="email-name">${email.name} ${email.date}</h5>
                <h4 class="email-subject">${email.subject}</h4>
                <p class="email-desc">
                    ${email.body}
                </p>
            </div>
        </div>        

  `).join('');  
  list.innerHTML = snippet;
  RenderClickItemEmail();
});

// Create a event when click to email Sent
var emailSent = document.querySelector('.email-sent');
emailSent.addEventListener('click', (e) => {
  e.preventDefault();
  // Delete all attribute in class selected
  var item = document.querySelectorAll('.menu-selected');
  for (i = 0; i < item.length; i++){
    item[i].classList.remove('menu-selected');
  }
  emailSent.classList.add('menu-selected');
  
  const bodyemail = document.querySelector('#list');  
  const snippet = emailsSent.map((email,idx) => `   
     		<div id=article_${idx} class="email-item pure-g" data-idx=${idx}>
            <div class="pure-u">
                <img width="64" height="64" alt="${email.subject}" class="email-avatar" src="${email.pic}">
            </div>
            <div class="pure-u-3-4">
                <h5 class="email-name">${email.name} ${email.date}</h5>
                <h4 class="email-subject">${email.subject}</h4>
                <p class="email-desc">
                    ${email.body}
                </p>
            </div>
        </div>        

  `).join('');  
  list.innerHTML = snippet;
  RenderClickItemEmail();
});

// Create a event when click to Email Trash
var emailTrash = document.querySelector('.email-trash');
emailTrash.addEventListener('click', (e) => {
  e.preventDefault();
  // Delete all attribute in class selected
  var item = document.querySelectorAll('.menu-selected');
  for (i = 0; i < item.length; i++){
    item[i].classList.remove('menu-selected');
  }
  emailTrash.classList.add('menu-selected');

  const bodyemail = document.querySelector('#list');  
  const snippet = emailsDeleted.map((email,idx) => `   
     		<div id=article_${idx} class="email-item pure-g" data-idx=${idx}>
            <div class="pure-u">
                <img width="64" height="64" alt="${email.subject}" class="email-avatar" src="${email.pic}">
            </div>
            <div class="pure-u-3-4">
                <h5 class="email-name">${email.name} ${email.date}</h5>
                <h4 class="email-subject">${email.subject}</h4>
                <p class="email-desc">
                    ${email.body}
                </p>
            </div>
        </div>        

  `).join('');  
  list.innerHTML = snippet;
  RenderClickItemEmail();
});