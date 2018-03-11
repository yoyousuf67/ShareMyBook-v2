module.exports.template=function(){
var some=  `
  <h3>
    BOOK DETAILS:
  </h3>
  <div class="ui divider"></div>
  <p>Terms and Conditions: <br>
  1.Fill in the details correctly or else you may be blocked from website if found guilty.<br>
  2.The resale value cannot be more than 40% of MRP.</p>
      <label class="ui inverted teal label">Book Type</label><br>
      <div class="ui search selection dropdown seven wide field" id="Booktype">
    <input type="hidden" name="Booktype">
    <i class="dropdown icon"></i>
    <div class="default text">Book Type</div>
    <div class="menu">
      <div class="item" data-value="Paperback">Paperback </div>
      <div class="item" data-value="Hardcover">Hardcover</div>
      <div class="item" data-value="Ebook">Ebook</div>
      <div class="item" data-value="Magazine">Magazine</div>
      <div class="item" data-value="Comic">Comic</div>
    </div>
    </div><br><br>
    <label class="ui inverted teal label">Language</label><br>
    <div class="ui search selection dropdown seven wide field" id="Language">
    <input type="hidden" name="Language" >
    <i class="dropdown icon"></i>
    <div class="default text">Book Language</div>
    <div class="menu">
    <div class="item" data-value="Assamese">Assamese </div>
             <div class="item" data-value="Bengali">Bengali</div>
             <div class="item" data-value="English">English</div>
             <div class="item" data-value="Gujarati">Gujarati</div>
             <div class="item" data-value="Hindi">Hindi</div>
             <div class="item" data-value="Kannada">Kannada</div>
             <div class="item" data-value="Marathi">Marathi</div>
             <div class="item" data-value="Odia">Odia</div>
             <div class="item" data-value="Tamil">Tamil</div>
             <div class="item" data-value="Telugu">Telugu</div>
             <div class="item" data-value="Urdu">Urdu</div>
             <div class="item" data-value="Other">Other</div>
    </div>
    </div><br> <br>
    <label class="ui inverted teal label">Select Category</label><br>
    <div class="ui search selection dropdown seven wide field" id="Category">
    <input type="hidden" name="Category" >
    <i class="dropdown icon"></i>
    <div class="default text">Category</div>
    <div class="menu">
    <div class="item" data-value="Education and Professional Books">Education and Professional Books</div>
               <div class="item" data-value="Fiction and Non-fiction">Fiction and Non-fiction</div>
               <div class="item" data-value="Philosophy">Philosophy</div>
               <div class="item" data-value="Families and Relationships">Families and Relationships</div>
               <div class="item" data-value="Spirituality">Spirituality</div>
               <div class="item" data-value="Reference Books">Reference Books</div>
               <div class="item" data-value="Self Help Books">Self Help Books</div>
               <div class="item" data-value="Other">Other</div>
    </div>
    </div><br><br>
      <label class="ui inverted teal label">Description About the Book</label><br>
      <textarea class=" seven wide field" name="Desc" placeholder="Description"></textarea>
      <br><br>
        <button class="ui teal labeled icon button"  onclick="partmanager('part2','part1')"><i class="angle left icon"></i>Back</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button class="ui teal labeled icon button" onclick="partmanager('part2','part3')"><i class="angle right icon"></i>Next</button>
  `
  return some;
};
