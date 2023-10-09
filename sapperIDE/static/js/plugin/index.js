var key = ''
var weburl = ''
function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// 用法示例：生成一个长度为 10 的随机字符串
var ids = generateRandomString(10);

function clear_conversion(){
    document.getElementById('conv-0').innerHTML = ''
    ids = generateRandomString(10);
    if (weburl != null && weburl !== "") {
                // 在这里可以将输入的Key提交到服务器进行处理
                $.ajax({
                    url: weburl,
                    type: 'post',
                    data:{
                        'id': ids,
                        'query': '',
                        'OpenaiKey': key
                    },
                    success: function (res){
                            res = JSON.parse(res)
                            for(var i = 0;i<res.Answer.length;i++) {
                                let answer = res.Answer[i]
                                $('.conversation-wrapper').append(generateDialog('Sapper', answer))
                                convWrapper.animate({
                                    scrollTop: convWrapper.prop('scrollHeight')
                                }, 500)
                                // msgInput.removeAttr('disabled')
                                $('#result_display').html('<h>' + res.Answer + '</h><br>')
                                hljs.highlightAll()
                            }
                    },
                    error: function (res){
                        alert('Error')
                        console.log(res)
                        // msgInput.removeAttr('disabled')
                    }
                })
            }
}

function generateMessage(msg){
    return '<p class="dialog-msg">'+ msg +"</p>"
}
function generateDialog(user, msg){
    return "<div class=\"conversation-dialog dialog-" + user.toLowerCase() + "\" data-role=\"" + user + "\">\n" +
        "    <div class=\"dialog-portrait\">\n" +
        "        <img src=\"../static/images/" + user.toLowerCase() + ".jpg\" class=\"dialog-portrait-img\">\n" +
        "        <p class=\"dialog-portrait-name\">" + user + "</p>\n" +
        "    </div>\n" +
        "    <div class=\"dialog-msg-wrapper\">\n" +
        "        <p class=\"dialog-msg\">" + msg + "</p>\n" +
        "    </div>\n" +
        "</div>"
}
$(document).ready(()=>{
    // tool tips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    // *** conversation transmission ***
    // input message
    let who = 'User'    // 'User' or 'Sapper'
    $(document).ready(function() {
        $("#conversation-key").click(function() {
            key = prompt("请输入Openai Key：", "");
            if (key != null && key !== "") {
                // 在这里可以将输入的Key提交到服务器进行处理
                alert('success')
            }
        });
        $("#conversation-url").click(function() {
            weburl = prompt("请输入Web Url：", "");
            if (weburl != null && weburl !== "") {
                // 在这里可以将输入的Key提交到服务器进行处理
                $.ajax({
                    url: weburl,
                    type: 'post',
                    data:{
                        'id': ids,
                        'query': '',
                        'OpenaiKey': key
                    },
                    success: function (res){
                            res = JSON.parse(res)
                            for(var i = 0;i<res.Answer.length;i++) {
                                let answer = res.Answer[i]
                                $('.conversation-wrapper').append(generateDialog('Sapper', answer))
                                convWrapper.animate({
                                    scrollTop: convWrapper.prop('scrollHeight')
                                }, 500)
                                // msgInput.removeAttr('disabled')
                                $('#result_display').html('<h>' + res.Answer + '</h><br>')
                                hljs.highlightAll()
                            }
                    },
                    error: function (res){
                        alert('Error')
                        console.log(res)
                        // msgInput.removeAttr('disabled')
                    }
                })
            }
        });
    });
    $('#msgForm').submit(function (e){
        // * display the input message in the conversation wrapper
        let currentDialog = $('.conversation-dialog').last()
        let convWrapper = $('.conversation-wrapper')
        let msgInput = $('#msgInput')
        // if send from the same user, append message in current dialog
        if (currentDialog.attr('data-role') === who){
            currentDialog.find('.dialog-msg-wrapper').append(generateMessage(msgInput.val()))
        }
        // else create a new dialog
        else{
            convWrapper.append(generateDialog(who, msgInput.val()))
        }
        convWrapper.animate({
            scrollTop: convWrapper.prop('scrollHeight')
        }, 500)
        // wait for response
        let message = msgInput.val()
        msgInput.val('')
        // msgInput.attr('disabled','disabled')


        // * send input message to server through ajax
        e.preventDefault()
        $.ajax({
            url: weburl,
            type: 'post',
            data:{
                'id': ids,
                'query': message,
                'OpenaiKey': key
            },
            success: function (res){
                    res = JSON.parse(res)
                    for(var i = 0;i<res.Answer.length;i++) {
                        let answer = res.Answer[i]
                        $('.conversation-wrapper').append(generateDialog('Sapper', answer))
                        convWrapper.animate({
                            scrollTop: convWrapper.prop('scrollHeight')
                        }, 500)
                        msgInput.removeAttr('disabled')

                        $('#result_display').html('<h>' + res.Answer + '</h><br>')
                        hljs.highlightAll()
                    }
            },
            error: function (res){
                alert('Error')
                console.log(res)
                msgInput.removeAttr('disabled')
            }
        })
    })

    // *** Dialog rendering ***
    // middle page

})
