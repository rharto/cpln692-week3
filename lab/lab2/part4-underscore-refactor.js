(function(){

  var map = L.map('map', {
    center: [39.9522, -75.1639],
    zoom: 14
  });
  var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  /* =====================

  # Lab 2, Part 4 — (Optional, stretch goal)

  ## Introduction

    You've already seen this file organized and refactored. In this lab, you will
    try to refactor this code to be cleaner and clearer - you should use the
    utilities and functions provided by underscore.js. Eliminate loops where possible.

  ===================== */

  // Mock user input
  // Filter out according to these zip codes:
  var acceptedZipcodes = [19106, 19107, 19124, 19111, 19118];
  // Filter according to enrollment that is greater than this variable:
  var minEnrollment = 300;

  // clean data - update
    _.each(schools, function(i) {
      if (typeof i.ZIPCODE === 'string') {
        i.ZIPCODE = _.first(i.ZIPCODE.split(' '));
      }

    if (typeof i.GRADE_ORG === 'number') {
      i.HAS_KINDERGARTEN = i.GRADE_LEVEL < 1;
      i.HAS_ELEMENTARY = 1 < i.GRADE_LEVEL < 6;
      i.HAS_MIDDLE_SCHOOL = 5 < i.GRADE_LEVEL < 9;
      i.HAS_HIGH_SCHOOL = 8 < i.GRADE_LEVEL < 13;
    } else {
      var grade = i.GRADE_LEVEL.toUpperCase();
      i.HAS_KINDERGARTEN = grade.indexOf('K') >= 0;
      i.HAS_ELEMENTARY = grade.indexOf('ELEM') >= 0;
      i.HAS_MIDDLE_SCHOOL = grade.indexOf('MID') >= 0;
      i.HAS_HIGH_SCHOOL = grade.indexOf('HIGH') >= 0;
    }
  });

  // filter data - update
  var filtered_data = [];
  var filtered_out = [];
  _.each(schools, function(i) {
    isOpen = i.ACTIVE.toUpperCase() == 'OPEN';
    isPublic = (i.TYPE.toUpperCase() !== 'CHARTER' ||
               i.TYPE.toUpperCase() !== 'PRIVATE');
    isSchool = (i.HAS_KINDERGARTEN ||
               i.HAS_ELEMENTARY ||
               i.HAS_MIDDLE_SCHOOL ||
               i.HAS_HIGH_SCHOOL);
    meetsMinimumEnrollment = i.ENROLLMENT > minEnrollment;
    meetsZipCondition = _.contains(acceptedZipcodes, i.ZIPCODE);
    filter_condition = (isOpen &&
                        isSchool &&
                        meetsMinimumEnrollment &&
                        !meetsZipCondition);

    if (filter_condition) {
      filtered_data.push(i);
    } else {
      filtered_out.push(i);
    }
  });

  console.log('Included:', filtered_data.length);
  console.log('Excluded:', filtered_out.length);

  // main loop - unchanged
  var color;

  //_.each(filtered_data, function(i) {
  for (var i = 0; i < filtered_data.length - 1; i++) {
    isOpen = filtered_data[i].ACTIVE.toUpperCase() == 'OPEN';
    isPublic = (filtered_data[i].TYPE.toUpperCase() !== 'CHARTER' ||
                filtered_data[i].TYPE.toUpperCase() !== 'PRIVATE');
    meetsMinimumEnrollment = filtered_data[i].ENROLLMENT > minEnrollment;

    // Constructing the styling  options for our map - unchanged
    if (filtered_data[i].HAS_HIGH_SCHOOL){
      color = '#0000FF';
    } else if (filtered_data[i].HAS_MIDDLE_SCHOOL) {
      color = '#00FF00';
    } else {
      color = '##FF0000';
    }
    // The style options - unchanged
    var pathOpts = {'radius': filtered_data[i].ENROLLMENT / 30,
                    'fillColor': color};
    L.circleMarker([filtered_data[i].Y, filtered_data[i].X], pathOpts)
      .bindPopup(filtered_data[i].FACILNAME_LABEL)
      .addTo(map);
  }

})();
