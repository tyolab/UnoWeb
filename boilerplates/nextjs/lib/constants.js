
function Constants () {
    this.scripts = {
        common:  [ 
            "https://www.googletagmanager.com/gtag/js?id=G-9MWSKJECC6",
            "/plugins/jQuery/jquery.min.js",
            "/plugins/bootstrap4/bootstrap.min.js",
            "/plugins/slick/slick.min.js",
            "/plugins/venobox/venobox.min.js",
            "/plugins/aos/aos.js",
            "/js/vendors/highlightjs/highlight.min.js",
            // "https://maps.googleapis.com/maps/api/js?key=AIzaSyCcABaamniA6OL5YvYSpB3pFMNrXwXnLwU&libraries=places"
            // "/plugins/google-map/gmap.js",
            "/js/script.js",
            // the scripts that are common to all pages
          ],

        // For the contact page
        contact: [
            // the scripts that are specific to the contact page
        ],

        
    }
}

export default new Constants();