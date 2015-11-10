
$(document).bind("mobileinit", function(){
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
});

$( "#pageLogIn" ).on( "pageinit", function() {

	if (localStorage.getItem("jrsServer") !== null) {
		$("#jrsServer").val(localStorage.getItem("jrsServer"))
	}
	if (localStorage.getItem("reportsPath") !== null) {
		$("#reportsPath").val(localStorage.getItem("reportsPath"))
	}
	if (localStorage.getItem("userName") !== null) {
		$("#userName").val(localStorage.getItem("userName"))
	}
	if (localStorage.getItem("password") !== null) {
		$("#password").val(localStorage.getItem("password"))
	}
	if (localStorage.getItem("rememberSettings") !== null) {
		if (localStorage.getItem("rememberSettings") === "true"){
			$("#rememberSettings").prop('checked', true).checkboxradio('refresh');
		}
	}

	//Validation code to enforce fields to be filled out
	$("#loginForm").validate({
		rules: {
			jrsServer: {
				required: true
			},
			userName: {
				required: true
			},
			password: {
				required: true
			}
		},
		messages: {
			jrsServer: {
				required: "JRS Server Required"
			},
			userName: {
				required: "Login Name Required"
			},
			password: {
				required: "Password Required"
			}
		},
	    errorPlacement: function (error, element) {
	        error.insertAfter( element.parent() );
	    },
	    submitHandler: function (form) { //If all rules are satisfied visualize is called

	    	if($('#rememberSettings').is(':checked')){
	    		localStorage.jrsServer = $("#jrsServer").val();
	    		localStorage.reportsPath = $("#reportsPath").val();
	    		localStorage.userName = $("#userName").val();
	    		localStorage.password = $("#password").val();
	    		localStorage.rememberSettings = "true";
	    	}else{
	    		localStorage.removeItem("jrsServer");
	    		localStorage.removeItem("reportsPath");
	    		localStorage.removeItem("userName");
	    		localStorage.removeItem("password");
	    		localStorage.removeItem("rememberSettings");
	    	}

	    	//alert(typeof(visualize));
			visualize({
				server: $("#jrsServer").val(),
				auth: { //Using basic auth for this demo
					name: $("#userName").val(),
					password: $("#password").val(),
				}
			}, function (v) {
				alert("tag2");
				//code for creating report list
				//goes here
				var search = v.resourcesSearch({
					folderUri: $("#reportsPath").val(),
					types:["reportUnit"],
					recursive: false,
					success: function(repo){
						alert("tag1");
						var listItems = [];
						repo.forEach(function(item,index,array){
							listItems.push('<li value='+ item.uri +'><a href="#">' + item.label +'</a></li>');
						})

						$('#report-list').append(listItems.join('')).listview('refresh');

     					$("#report-list").listview("refresh");
						//console.log(repo);
					},
					error: function(err){
						console.log(err);
						alert(err);
					}
				});

				//code for attaching report that runs when list item is selected
				$(document).on("click", "#report-list li" ,function (event) {
				    //alert($(this).attr("value"));
				    var listItem = this;
				    //clean container
					$("#reportContainer").html("");

					//render report from another resource
					v("#reportContainer").report({
						resource: $(listItem).attr("value"),
						success: function(){
							$("#pageDisplayReportTitle").html($(listItem).text());
							$.mobile.changePage('#pageDisplayReport', {
					            transition: 'pop',
					            changeHash: true,
					            role: 'dialog'
					        });
						},
						error:handleError
					});

				}); 

				

				//show error
				function handleError(err){
					alert(err.message);
				}


				//destroy session
				//$("#logout").unbind('click'); No longer needed because I'm re-loading the page for logout
				$("#logout").click(function () {
					v.logout().done(function () {

						document.location.href = 'index.html?var='+Date.now();

						// $("#userName").val("");
						// $("#password").val("");
						// $(':mobile-pagecontainer').pagecontainer('change', '#pageLogIn', {
						// 	reload: false
						// });
					});
				});

				//Change to page with list of reports
				$(':mobile-pagecontainer').pagecontainer('change', '#pageReportList', {
		        	reload: false
		        });

			}, function (error){

				alert("error");
				$("#pageLogInPopupContent").html(error.message);
				$( "#pageLogInPopup" ).popup("open");

			});

			//The return false is returned to the form keeping the form from trying to submit and allowing 
			//the submitHandler above to take care of this task
	        return false;
	   	}
	});
});


function runReport(r){
	console.log(r);


	$.mobile.changePage('#pageDisplayReport', {
            transition: 'pop',
            changeHash: true,
            role: 'dialog'
        });


}






