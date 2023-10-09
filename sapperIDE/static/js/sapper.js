$(document).ready(()=>{

    // change the navbar on scroll
    $(window).scroll(function (){
        let nav = $('.my-navbar')
        let cover = $('#cover')
        let navLink = $('.nav-link')
        // start scroll
        if (cover.offset().top - $(document).scrollTop() <= -100){
            nav.css({'height':'85px', 'position':'fixed', 'background':'white', 'box-shadow': 'rgba(149, 157, 165, 0.2) 0px 8px 24px'})
            navLink.css({'color':'var(--first)', 'font-weight':'normal'})
            navLink.mouseover(function() {
                $(this).css({'color':'navajowhite'})
            }).mouseout(function (){
                $(this).css({'color':'var(--first)'})
            });
        }
        // back to the top
        else{
            nav.css({'height':'80px', 'position':'absolute', 'background':'', 'box-shadow': ''})
            navLink.css({'color':'whitesmoke', 'font-weight':'normal'})
            navLink.mouseover(function() {
                $(this).css({'color':'navajowhite'})
            }).mouseout(function (){
                $(this).css({'color':'whitesmoke'})
            });
        }
    })

    // click card to redirect
    $('.module-card').click(function (){
        window.location.href = 'content.html'
    })
})