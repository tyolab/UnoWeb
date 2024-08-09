
function Utils () {

}

Utils.prototype.formatDate = (date) => {
	return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default new Utils();