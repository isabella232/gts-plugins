/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @name gts.DatePicker
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Calendar date picker for EnyoJS. Shows a calendar.
 * When the selected date changes, the onSelect event is called with the current values as a date object.
 * Using getValue or setValue will get or set the datetime with a Date object. Setting a new value will change the view date.
 * Using getViewDate or setViewDate will get or set the display datetime with a Date object.
 *
 * @class
 * @version 2.2 (2012/11/10)
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Onyx (https://github.com/enyojs/onyx)
 * @requies g11n (https://github.com/enyojs/g11n)
 * @requies Layout/Fittable (https://github.com/enyojs/layout)
 */
enyo.kind({
	name: "gts.DatePicker",
	kind: "enyo.Control",

	classes: "gts-calendar",

	/** @public */
	published: {
		/** @lends gts.DatePicker# */

		/**
		 * Currently selected date
		 * @type Date object
		 * @default current date
		 */
		value: null,

		/**
		 * Current locale used for formatting (see enyo g11n)
		 * @type string
		 * @default g11n locale detection
		 */
		locale: "",

		/**
		 * Disables changing the value (NYI)
		 * @type boolean
		 * @default false
		 */
		disabled: false,

		/**
		 * Currently shown month
		 * @type Date object
		 * @default current date
		 */
		viewDate: null,

        /**
         * List of specail date boxes that are colored or disabled.
         * This should be formated as an object whose keys are dates 
         * represented as an RFC2822 date. Each of these keys should point to
         * another object specifying desired color and indicating
         * if the date button should be disabled.
         * ex: 
            this.specialDates = 
                {
                    "June 06, 2009": {
                        "color": "#000000", 
                        "disable" : false
                    },
                    "Aug 18, 2011": {
                        "color": "#FFFFFF",
                        "disable" : true
                    }
                };
         * There is a helper function addSpecialDates() that will accept a range
         * of dates fromatted in a way that Date.parse() can interperate.
         * @type object
         * @default null
         */
        specialDates: null,

		/**
		 * Format of day of week (see enyo g11n)
		 * @type string
		 * @default "medium"
		 */
		dowFormat: "medium",

		/**
		 * Format of month in header (see enyo g11n)
		 * @type string
		 * @default "MMMM yyyy"
		 */
		monthFormat: "MMMM yyyy"
	},

	events: {
		onSelect: ""
	},

	/** @private */
	components: [
		{
			kind: "FittableColumns",
			components: [
				{
					kind: "onyx.Button",
					content: "<<",

					ontap: "monthBack"
				}, {
					name: "monthLabel",
					tag: "strong",

					classes: "month-label",
					fit: true
				}, {
					kind: "onyx.Button",
					content: ">>",

					ontap: "monthForward"
				}
			]
		},

		//Calendar week header
		{
			classes: "date-row day-of-week",
			components: [
				{
					name: "sunday",

					content: "Sun",
					classes: "week-label"
				}, {
					name: "monday",
					content: "Mon",
					classes: "week-label"
				}, {
					name: "tuesday",
					content: "Tue",
					classes: "week-label"
				}, {
					name: "wednesday",
					content: "Wed",
					classes: "week-label"
				}, {
					name: "thursday",
					content: "Thu",
					classes: "week-label"
				}, {
					name: "friday",
					content: "Fri",
					classes: "week-label"
				}, {
					name: "saturday",
					content: "Sat",
					classes: "week-label"
				}
			]
		},

		//Calendar dates (6 rows of 7 cols)
		{
			classes: "date-row",
			components: [
				{
					name: "row0col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			classes: "date-row",
			components: [
				{
					name: "row1col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			classes: "date-row",
			components: [
				{
					name: "row2col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			classes: "date-row",
			components: [
				{
					name: "row3col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			classes: "date-row",
			components: [
				{
					name: "row4col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			classes: "date-row",
			components: [
				{
					name: "row5col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		},

		{
			kind: "FittableColumns",
			style: "margin-top: 1em;",

			components: [
				{
					name: "client",
					fit: true
				}, {
					kind: "onyx.Button",
					content: "Today",
					ontap: "resetDate"
				}
			]
		}
	],

	create: function() {

		this.inherited( arguments );

		if( enyo.g11n && this.locale == "" ) {

			this.locale = enyo.g11n.currentLocale().getLocale();
		}

		this.value = this.value || new Date();
		this.viewDate = this.viewDate || new Date();

        this.specialDates = this.specialDates || {};

		this.localeChanged();
	},

	localeChanged: function() {

		// Fall back to en_us as default
		this.days = {
				"weekstart": 0,
				"short": [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
				"full": [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
			};

		//Attempt to use the g11n lib (ie assume it is loaded)
		if( enyo.g11n ) {

			var formats = new enyo.g11n.Fmts( { locale: new enyo.g11n.Locale( this.locale ) } );

			this.days = {
					"weekstart": formats.getFirstDayOfWeek(),
					"medium": formats.dateTimeHash.medium.day,
					"long": formats.dateTimeHash.long.day
				};
		}

		this.$['sunday'].setContent( this.days[this.dowFormat][0] );
		this.$['monday'].setContent( this.days[this.dowFormat][1] );
		this.$['tuesday'].setContent( this.days[this.dowFormat][2] );
		this.$['wednesday'].setContent( this.days[this.dowFormat][3] );
		this.$['thursday'].setContent( this.days[this.dowFormat][4] );
		this.$['friday'].setContent( this.days[this.dowFormat][5] );
		this.$['saturday'].setContent( this.days[this.dowFormat][6] );
	},

	rendered: function() {

		this.inherited( arguments );

		this.renderDoW();
		this.valueChanged();
	},

	setValue: function( inValue ) {

		if( enyo.isString( inValue ) ) {

			inValue = new Date( inValue );
		}

		this.value = inValue;

		this.valueChanged();
	},

	valueChanged: function() {

		if( Object.prototype.toString.call( this.value ) !== "[object Date]" || isNaN( this.value.getTime() ) ) {
			//Not actually a date object

			this.value = new Date();
		}

		this.setViewDate( this.value );
	},

	setViewDate: function( inViewDate ) {

		if( enyo.isString( inViewDate ) ) {

			inViewDate = new Date( inViewDate );
		}

		this.viewDate = inViewDate;

		this.viewDateChanged();
	},

	viewDateChanged: function() {

		this.renderCalendar();
	},

    /*This function will accept an array of objects in the following format:
        newDates = [
            {
                'start': <Start Date>,
                'end': <End Date>,
                'color': <Color Code>,
                'disable': <Boolean>
            }
        ]
        where <Start Date> and <End Date> are parseable by Date.parse()
        and <Color Code> is a valid CSS color. A single date can be added by
        omitting the 'end' value.
    */
    addSpecialDates: function( newDates ) {
        var startDate, endDate;
        for(var range_i = 0 range_i < newDates.length; range_i++){
            startDate = Date.setTime(Date.Parse(newDates[range_i].start));
            if(!startDate){continue;}

            endDate = 
                newDates[range_i].end ?
                Date.setTime(Date.Parse(newDates[range_i].end)) :
                startDate;
            
            var dString;
            for(
                var date_i = startDate.getTime(); 
                date_i < endDate.getTime(); 
                date_i += 86400000
            ){
                dString = Date.setTime(date_i).toDateString();
                this.specialDates[dString] = this.specialDates[dString] || {};
                this.specialDates[dString].color = newDates[range_i].color;
                this.specialDates[dString].disable = newDates[range_i].disable;
            }
        }
        
        this.specialDatesChanged();
    },

    specialDatesChanged: function( inValue ) {

        this.renderCalendar();
    }

	renderDoW: function() {

		this._renderDoW();
	},

	_renderDoW: function() {

		var cellWidth = Math.round( 10 * this.getBounds()['width'] / 7 ) / 10;

		this.$['sunday'].applyStyle( "width", cellWidth + "px" );
		this.$['monday'].applyStyle( "width", cellWidth + "px" );
		this.$['tuesday'].applyStyle( "width", cellWidth + "px" );
		this.$['wednesday'].applyStyle( "width", cellWidth + "px" );
		this.$['thursday'].applyStyle( "width", cellWidth + "px" );
		this.$['friday'].applyStyle( "width", cellWidth + "px" );
		this.$['saturday'].applyStyle( "width", cellWidth + "px" );
	},

	renderCalendar: function() {

		this._renderCalendar();
	},

	_renderCalendar: function() {

		var cellWidth = Math.round( 10 * this.getBounds()['width'] / 7 ) / 10;
		var today = new Date();

		//Reset viewDate to first day of the month to prevent issues when changing months
		this.viewDate = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 1 );

		var dispMonth = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 0 );//Prev month, last day of month; Cycled object for diplay data
		var currMonth = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 1 );//Current month, first day of month

		dispMonth.setDate( dispMonth.getDate() - currMonth.getDay() + 1 );

		if( dispMonth.getTime() === currMonth.getTime() ) {
			//Curr starts on a Sunday; shift back

			dispMonth.setDate( dispMonth.getDate() - 7 );
		}

		var rowCount = 0;

		var buttonType;

		while( rowCount < 6  ) {
			//Always display 6 rows of date information

			if( dispMonth.getDate() === this.value.getDate() &&
				dispMonth.getMonth() === this.value.getMonth() &&
				dispMonth.getFullYear() === this.value.getFullYear() ) {
				//Currently selected date

				buttonType = "onyx-blue";
			} else if( dispMonth.getDate() === today.getDate() &&
				dispMonth.getMonth() === today.getMonth() &&
				dispMonth.getFullYear() === today.getFullYear() ) {

				buttonType = "onyx-affirmative";
			} else if( dispMonth.getMonth() !== currMonth.getMonth() ) {
				//Month before or after focused one

				buttonType = "onyx-dark";
			} else {

				buttonType = "";
			}

			this.$['row' + rowCount + 'col' + dispMonth.getDay()].applyStyle( "width", cellWidth + "px" );

			//Remove added classes
			this.$['row' + rowCount + 'col' + dispMonth.getDay()].removeClass( "onyx-affirmative" );
			this.$['row' + rowCount + 'col' + dispMonth.getDay()].removeClass( "onyx-blue" );
			this.$['row' + rowCount + 'col' + dispMonth.getDay()].removeClass( "onyx-dark" );

			//Add proper class
			this.$['row' + rowCount + 'col' + dispMonth.getDay()].addClass( buttonType );

			this.$['row' + rowCount + 'col' + dispMonth.getDay()].setContent( dispMonth.getDate() );
			this.$['row' + rowCount + 'col' + dispMonth.getDay()].ts = dispMonth.getTime();//Used by ontap

			dispMonth.setDate( dispMonth.getDate() + 1 );

			if( dispMonth.getDay() === 0 && rowCount < 6 ) {

				rowCount++;
			}
		}

		if( enyo.g11n ) {

			var fmt = new enyo.g11n.DateFmt( this.monthFormat );

			this.$['monthLabel'].setContent( fmt.format( currMonth ) );
		} else {

			this.$['monthLabel'].setContent( currMonth.getMonth() + " - " + currMonth.getFullYear() );
		}
	},

	monthBack: function() {

		this.viewDate.setMonth( this.viewDate.getMonth() - 1 );

		this.renderCalendar();
	},

	monthForward: function() {

		this.viewDate.setMonth( this.viewDate.getMonth() + 1 );

		this.renderCalendar();
	},

	resetDate: function() {
		//Reset button pressed

		this.viewDate = new Date();
		this.value = new Date();

		this.renderCalendar();

		this.doSelect( { "date": this.value } );
	},

	dateHandler: function( inSender, inEvent ) {
		//Date button pressed

		var newDate = new Date();
		newDate.setTime( inSender.ts );

		this.value.setDate( newDate.getDate() );
		this.value.setMonth( newDate.getMonth() );
		this.value.setFullYear( newDate.getFullYear() );

		if( this.value.getMonth() != this.viewDate.getMonth() ) {

			this.viewDate = new Date( this.value.getFullYear(), this.value.getMonth(), 1 );
		}

		this.doSelect( { "date": this.value } );
		this.renderCalendar();
	}
});
