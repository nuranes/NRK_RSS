$("document").ready(function(){
	
	//XML object
	var nrkXMLObject = null;
	
    //HTML objects
    var $headerTitle;
	var $dropdowns;
    var $mainContent;

    //init
    var init = function(){
        
        //setHTMLObjects
        var setHTMLObjects = function(){console.log("Funker");//Success message in console
			$headerTitle = $("#headerTitle");
			$dropdowns = $("#dropdowns");
			$mainContent = $("#mainContent");
        }();//end setHTMLObjects
        
        var initPage = function(){
			getNrkXML(); //When page loads getNrkXML
        }(); //end init
    
    }(); //end init

    //getNrkXML
	function getNrkXML(){ 
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){ 
			if (this.readyState == 4 && this.status == 200){
				setDropdown(this);
			}
		};
		xmlhttp.open("GET", "xml/nrk-rss.xml", true); //Get XML-file
		xmlhttp.send();
	}//end getNrkXML
    
    function setDropdown(xml){ //Set dropdown-menu whit data from XML-file
		var xmlDoc = xml.responseXML; //Set XMLresponse in this function

        $(xmlDoc).find("site").each(function(){ //For each object "site" in XML-file
            
            //Set and get values from "site" in XML to create the dropdown-menu
            var title = $("title", this).text();
            var urls = $("nrkUrl", this).text();

            var $newSite = $("<li>")
                .append($("<a>").html(title))
                .attr(
                    {
                        "data-url": urls
                    }
                )
                .on("click", function(){ //onClick
                    var $feedTitle = title; 
                    $headerTitle.append().empty(); //Remove headerTitle..
                    $headerTitle.append("NRK RSS - ", $feedTitle); //..and append new title 
                });

            $dropdowns.append($newSite); //Append/put newSite in dropdown-menu
        });
        setUrls(); //Get urls to connect them to titles in dropdown-menu
	}//end setDropdown
    
    function setUrls(){ //Connect newSite to url
        $("li").on("click", function(){ //When clicking om newSite
            var dataUrl = $(this).attr("data-url"); //Get nrkUrl from XML-file
            var url = "proxy.php?nrkUrl=" + dataUrl; //Put proxyUrl together with nrkUrl..
            
            makeNrkCall(url); //..and send the combined urls to makeNrkCall 
        });//end onClick
    }//end setUrls
			
    function makeNrkCall(url){ //Get nrkUrl through proxy.php and set items in mainContent
        $.ajax(
			{
				url: url, //proxy.php + nrkUrl
				method: "GET",
				dataType: "xml",
                
                success: function(nrkXMLObject){ //Runs if success with getting nrkXMLObjekt
					$mainContent.html(""); //Empty mainContent when user clicks on newSite i dropdown-menu
                    
					$(nrkXMLObject).find("item").each(function(){ //For each "item" in nrkRSS
                        
                        //Set and get values from nrkRSS/nrkUrl
						var title = $("title", this).text();
						var date = $("pubDate", this).text();
						var thumbnail = $("enclosure", this).attr("url");
						var description = $("descriotion", this).text();

						var $newArticle = $("<article>")
							.addClass("col-md-4")
							.append( //Appending elements to an created article
								$("<h3>").html(title),
								$("<p>").html(date),
								$("<img>", {src: thumbnail}).addClass("img-responsive"),
								$("<p>").html(description)
							);
						$mainContent.append($newArticle); //Appending article to mainContent i .html
					});
                },
                error: function(){ //Show error message in console if call failes
                    console.log("Noko gjekk galt med henting av NRK feed.");
                }
			});//end ajax call
	}//end makeNrkCall
});