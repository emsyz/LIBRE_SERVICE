/////// (C) POESIESCENDREES
/*

    README :
        this js package presents 5 ways to hide, display and toggle elements
        with an attached trigger. an example is set at the following link :
            XXXXX

        (all the following explanations down below are on this page, i recommand you to read them there it'll be easier ahah, and in a french version if needed)

        there's no skill in javascript needed for you to use the features
        but it will be much easier if you're comfortable with HTML & CSS.

        you can use this package on your tumblr, as the administrator of
        your forum (NOT as a member since you won't be able to add js) or
        in any HTML page, actually.

        you don't have to credit me but it would be very appreciated :)
        and please like/repost the post on my tumblr if you use this, thank you !
        https://poesiescendrees.tumblr.com/


    HOW TO USE THE PACKAGE
        (1) import the jquery library
            it is automatically done on forumactif but else, you may have to add
            this to your code (in the <head> or just before the closing tag </body>) :
                <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>

        (2) import this js library
            very similarly, you copy/paste the following link
            AT THE END of the body (just before the closing tag </body>)
                XXXXXXXX

        and there it is ! the functions are now available. you can use them
        as many times as you want in the same page. each times, you have set
        of 2 elements : the TRIGGER(S) that, when you click on it/them,
        display/hide/toggle the TARGET(S). the different elements
        can be of any type (div, a, span, button, p, custom elements...)
        but the triggers need to be recognized with a class specific to the
        feature used.

        the list of the differrent functions and their explanation on how
        to use them is made just below :

        NOTE : sometimes, i use a notation $(xxx) when
        talking about an element whose tag name is "xxx", for example :
            <div>...</div> --> i'll call it $(div)

        moreover, the target="something"
                      toggling="something"
                      children="something"

        are used for a trigger when it targets the $(something)
        element. you need to add '.' for a class or '#' for an id.
        for example :
            <a class="toggle" target=".rimbaud">coucou</a> --> toggles .rimbaud
            <span class="rimbaud">...</span>               --> is toggled
            <div class="rimbaud">...</div>                 --> also toggled

            <button class="hide" target="#verlaine">yo</button> --> hides #jsp
            <p id="verlaine">...<p>                             --> hidden

            <a class="display" target="p.special">jsp</a> --> toggles "p" with class .special
            <p class="special">...</p>                    --> toggled
            <section class="special">...</section>        --> not toggled : is not a "p"
            <p>...</p>                                    --> not toggled : hasn't the class .special
            <p class="special other_random_class">...</p> --> toggled



    LIST OF DIFFERENT FUNCTIONS & CLASSES OF TRIGGERS IN THE PACKAGE :

        (1&2&3) class="toggle/hide/display"     (toggling & hiding)
             -> triggering $(element) will hide/display $(target)
                or will toggle it (if already hidden, displays it,
                otherwise it will hide it)
             -> structure :

            <element class="toggle/hide/display" target="target"></element>
            ...
            <target>this element will be displayed or hidden</target>

            -> example :
                <button class="toggle other-random-class" target=".pinkfloyd">
                    some text
                </button>
                <p class=".pinkfloyd">i am displayed and hidden</p>




        (4) class="toggle_inside"        (list of tabs with buttons)
         -> at first, all children of $(parentTarget) are hidden and
            triggering the $(triggers:nth-of-type) inside the $(element)
            will display the child:nth-of-type of $(parentTarget)
         -> structure :

            <element class="toggle_inside" toggling="parentTarget" children="triggers">
                <triggers>first</triggers>
                <triggers>second</triggers>
                <triggers>third</triggers>
            </element>

            <parentTarget>
                <element>toggled with first trigger</element>
                <element>toggled with second trigger</element>
                <element>toggled with third trigger</element>
            </parentTarget>




        (5) toggle_from_list    (button toggling element from specific parent)
         -> triggering $(element) will hide all children of $(parentTarget)
            no matter their initial state, and $(target) will be displayed
            (you can use target=":nth-child(3)" to target the third child,
            for example, or any child that you know is in the parentTarget,
            with a class, an id, its tag name...)
         -> structure :

            <element class="toggle_from_list" toggling="parentTarget" target="target:nth-of-type(2)">
            </element>

            <parentTarget>
                <target>after trigger, this is hidden</target>
                <target>after trigger, only this is displayed</target>
                <target>after trigger, this is hidden</target>
            </parentTarget>




    NOTES :
        --> none of the classes or id or tag name should start with a number
        (it is a rule in CSS but it's very important in
        this javascript code, otherwise functions may not work)

        IF YOU USE AT LEAST ONE OF THOSE CLASSES :
        --> in CSS, set for (each) target its var(--display) :
                target {--display: block/grid/etc.;}
            so that when you click on a trigger, it displays
            the specific target with the value of var(--display)
            (if not specified, it is automatically set to --display: block)

        IF YOU USE "toggle_inside" OR "toggle_from_list" :
        --> aesthetically better if you already mention in css :
            target {display: none;}
            target:first-of-type {display : block/grid/etc.}
        though, it will work without that but it will
        appear briefly while the page is loading

        IF YOU USE "toggle_inside" :
        --> you can put the parentTarget within the element
            (the parent of the triggers) but you should explicitely
            specify that it is not a trigger :
            example :

                <div class="toggle_inside" toggling=".test">
                    <button>one</button>
                    <button>two</button>

                    <div class="test">
                        <span>displayed with one</span>
                        <span>displayed with two</span>
                    </div>
                </div>

                --> the $('.test') is taken as a trigger,
                like the other buttons, so when you
                click on the div, it hides all elements within itself
                and searches for its third elements.
                (which normally doesn't exist, except if you put a
                third <span> in $('.test'))
                --> if you wanna correct that behavior, specify
                    that only <button> are triggers so that
                    <div> is not taken as such :

                <div class="toggle_inside" toggling=".test" children="button">
                    ...
                </div>
*/



$('.table_js').wrapInner('<table><tr><td></table></tr></td>');
$('.scroll_js').wrapInner('<scroll></scroll>');

setToggleInside(".toggle_inside");
setToggleInside(".toggle_from_list", 'toggling', 'undefined');

setFunctions(".toggle", "flipDisplay", ["target"]);
setFunctions('.display', 'display', ["target"]);
setFunctions('.hide', 'hide', ["target"]);



function credits(){
    $('footer').prepend(`
        <div class="table_js" style="display: block !important;"><mg id="credits" style="display: inline !important;"><a href="https://poesiescendrees.tumblr.com/" style="display: inline !important;">(poesiescendrees)</a></mg></div>
        `)
}

function getClass(el) {
  return $(el).attr('class').split(' ');
}

function setFunctions(targetSelector, nameFunction, listOfArgs=[]) {
  $(targetSelector).each(function() {
    var ths = $(this);

    var onclick = nameFunction + "(";

    for (var i = 0; i < listOfArgs.length; i++) {
      var toAdd = ths.attr(listOfArgs[i]);
      if (typeof toAdd == 'string') toAdd = "'" + toAdd + "'";
      if (i != (listOfArgs.length - 1)) toAdd += ",";
      onclick += toAdd;
    }
    onclick += ')';
    ths.attr('onclick', onclick);
  });
}

function hide(el) {
  var ths = $(el);
  if (typeof ths.css('--display') == 'undefined') {
    if (ths.css('display') != 'none') ths.css('--display', ths.css('dislay'));
    else ths.css('--display', 'block'); // default : block
  }
  ths.css('display', 'none');
}

function display(el) {
  var ths = $(el);
  if (typeof ths.css('--display') == 'undefined') ths.css('--display', 'block');
  ths.css('display', ths.css('--display'));
}

function flipDisplay(el) {
  var ths = $(el);
  if (ths.css('display') != 'none') {
    if (typeof ths.css('--display') == 'undefined') ths.css('--display', ths.css('display'));
    ths.css('display', 'none');
  } else {
    if (typeof ths.css('--display') == 'undefined') ths.css('--display', 'block');
    ths.css('display', ths.css('--display'));
  }
}

function setToggleInside(parentSelector='.toggle_inside', parentAttr='toggling', childrenSelector='children', targetAttr="target") {

  $(parentSelector).each(function() {
    var ths = $(this);

    // verifies which children to set : selects all if not specified
    if (childrenSelector == 'undefined') {
      var setFrom = ths;
    } else {
      var children = ths.attr(childrenSelector);
      if (typeof children == 'undefined' || children == '') {
        children = '*';
      }
      var setFrom = ths.find(children);
    }

    var target = ths.attr(parentAttr);
    var count = 0;
    var tgt = ths.attr(targetAttr);

    if (typeof target != 'undefined') {
      var xx = ths.find(children);
      setFrom.each(function() {
        count++;

        if (typeof ths.attr(targetAttr) == 'undefined') {
            var totoggle = count;
        } else if (!isNaN(parseInt(tgt))) {
            var totoggle = parseInt(tgt);
        } else {
            var totoggle = tgt;
            $('.section1').append(isNumeric('3a'));
        }

        if (typeof totoggle == 'string') totoggle = "'" + totoggle + "'";

        var onclick = `toggleFromList('` + target + `',` + totoggle + `)`;

        $(this).attr('onclick', onclick);
      });
    }

    if (parentSelector == '.toggle_inside') {
        toggleFromList(target);
    }

  });
}


/**

Sets all $(nameChildren nameParent) to 'display: none'
and sets $(nameChildren nameTarget) to 'display : var(--display)'
                                       (sets it to 'block' if undefined);

 * @param             {string}  nameParent     name of parent

 * @param   {string || number}  nameTarget     name of child which is toggled
                                               if 'string' : child within the parent
                                               if 'number' : nameChildren:nth-of-type
                                                             (:nth-child if nameChildren == '*')
                                               // DEFAULT : 1 (:first-of-type/first-child)

 * @param             {string}  nameChildren   name of children to be hidden within the parent
                                               DEFAULT : '*' (all children)

       example :
           <section>
             <span class="el1">span 1</span>
             <span class="el2">span 2</span>
             <span class="el3">span 3</span>
             <div class="el4">div 1</div>
             <div class="el5" style="--display: grid;">div 2</div>
           </section>

           >>> toggle('section')
           .el[2:5] - display : none      // hidden by the function
           .el1 - display : block         // targetted by default with default --display

           >>> toggle('section', '4')
           .el[1:5 \ 4] - display : none  // hidden by the function
           .el4 - display : block         // targetted with default --display

           >>> toggle('section', 2, 'div')
           .el[1:3] - display : inline    // not affected by the function
           .el4 - display : none          // hidden by the function
           .el5 - display: grid;          // targetted with its --display
 */
function toggleFromList(nameParent, nameTarget=1, nameChildren='*') {
  var all = $(nameParent);

  // [ STEP 1 ] verifies the name of target
  if (typeof nameTarget == 'number') {

    if (nameChildren == '*') {
      nameTarget = nameChildren + ':nth-child(' + nameTarget + ')';
    } else {
      nameTarget = nameChildren + ':nth-of-type(' + nameTarget + ')';
    }
  }

  // [ STEP 2 ] sets every children selected with 'display: none'
  // and checks every '--display:' (sets to 'block' if undefined)
  all.children(nameChildren).each(function() {
    var ths = $(this);

    if (typeof ths.css('--display') == 'undefined'){
      ths.css('--display', 'block');
    }

    if (ths.css('display') != 'none') {
      ths.css('display', 'none');
    }

  });

  // [ STEP 3 ] displays the target (from [STEP1]) to its --display
  all.children(nameTarget).each(function() {
    $(this).css('display', $(this).css('--display'));
  });
}

function css (el='body', attr='background', color='red'){
    $(el).css(attr,color);
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
