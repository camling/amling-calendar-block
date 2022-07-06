function get_current_events()
    {
      async function fetchAllCalendarEvents() 
        {
          
       
            const response = await fetch('https://'+library_id_object.library_id.library_id_0+'.evanced.info/api/signup/eventlist?isOngoingVisible=true&isSpacesReservationVisible=false&onlyRegistrationEnabled=false&onlyFeaturedEvents=false');
            if (!response.ok) {
              const message = `An error has occurred: ${response.status}`;
              throw new Error(message);
            }
            const events = await response.json();
            return events;
        }
        let all_events = fetchAllCalendarEvents();
    
        return all_events;
    
    }

    let event_array = [];
    get_current_events().then(events => {
      
      events.forEach(event => {
        event_array.push({"id":event.EventId, "title":event.Title});
      });
    
    });
    console.log(event_array);  // delete

wp.blocks.registerBlockType("amling/demo-block",{
    title: "Calendar Details" ,
    description: "User enters calendar id and gets calendar data back which is added to page",
    icon: "tide",  // WordPress dashicons 
    category: "awesome-blocks", // Under which block category your block will be. I'm making mine awesome
    attributes: {
        calendar_id: {type: "string"},
        calendar_select: {type: "string"},
        calendar_title: {type: "string"},
        calendar_date: {type: "string"},
        calendar_time: {type: "string"},
        calendar_description: {type:"string"},
        calendar_link: {type:"string"}
    }, // the data we want to track
    
    
    // calls this function when the block is edited
    edit: function(props){

        function update_content(e) {
          // console.log(e);
            props.setAttributes({calendar_id: e.target.value});     
        }

        function removeTags(str) {
            if ((str===null) || (str===''))
            return false;
            else
            str = str.toString();
            return str.replace( /(<([^>]+)>)/ig, '');
         }

         function formatAMPM(date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            let strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
          }
          

        function get_calendar_data()
        {
            let id = props.attributes.calendar_id;

            async function fetchCalendarEvents() 
            {
             
              
                const response = await fetch('https://'+library_id_object.library_id.library_id_0+'.evanced.info/api/signup/eventlist?isOngoingVisible=true&isSpacesReservationVisible=true&onlyRegistrationEnabled=false&onlyFeaturedEvents=false&eventId='+ id);
                if (!response.ok) {
                  const message = `An error has occurred: ${response.status}`;
                  throw new Error(message);
                }
                const events = await response.json();
                return events;
              }

              fetchCalendarEvents()
              .then(events => {

                let link = `https://${library_id_object.library_id.library_id_0}.evanced.info/signup/eventdetails?eventid=${props.attributes.calendar_id}&lib=0`;
                const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

                let date = new Date(events[0].EventStart);
                let display_date = days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
                let display_time = formatAMPM(date);
          

                  props.setAttributes({calendar_title: events[0].Title});
                  props.setAttributes({calendar_date: display_date});
                  props.setAttributes({calendar_time: display_time});
                  props.setAttributes({calendar_description: removeTags(events[0].Description)});
                  props.setAttributes({calendar_link: link});
                       
              }).catch(error => {
                alert(props.attributes.calendar_id + " is not a valid calendar id");
                error.message; // 'An error has occurred: 404'
              });
      
       
    }


          function makeOptions(event)
          {
            return wp.element.createElement("option", {value: event.id}, event.title);
          }


          return  (
          wp.element.createElement("div", null,           
            wp.element.createElement("h3", null, "Enter Calendar Event ID"), 
            wp.element.createElement("select",{onChange: update_content},
              wp.element.createElement("option", {disabled:true, selected:true, value:"none"},"select an option"),
              event_array.map(makeOptions)
              ),
          wp.element.createElement("input", {
            type: "text",
            value: props.attributes.calendar_id,
            onChange: update_content
          }), 
          wp.element.createElement("input", {
            type: "button",
            value: "Get Data",
            onClick: get_calendar_data
        })));
        }, //End Edit

    
    // calls this function when the block is saved and outputs the html
    save: function(props){
        function write_calendar_data()
        {
            return wp.element.createElement("div", null, wp.element.createElement("a", {
                href: props.attributes.calendar_link
              }, wp.element.createElement("h3", null, props.attributes.calendar_title)), wp.element.createElement("h4", null, "When: ", props.attributes.calendar_date, " at ", props.attributes.calendar_time), wp.element.createElement("p", null, props.attributes.calendar_description));
        }

        return write_calendar_data();
    }
}) // name of block, object of attributes
