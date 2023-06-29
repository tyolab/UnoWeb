
function Helpers () {

}

Helpers.prototype.createInfoParagraph = (para) => {
	if (para == null) 
		return null;

	let blocks = para.map((p) => {
		return (
		<p className="mt-5">
			{p}
		</p>
		);
	});
	return (
		<>
			{blocks}
		</>
	);
}

Helpers.prototype.splitParagraphs = (p) => {
	let p1 = [];
	let p2 = [];
	let split_start = false;
	for (let i = 0; i < p.length; i++) {
		if (p[i].indexOf('PARASTOPDONTDELETE') > -1) {
			split_start = true;
			continue;
		} 
		
		if (!split_start) {
			p1.push(p[i]);
		}
		else {
			p2.push(p[i]);
		}
	}
	if (p2.length == 0) {
		return [null, p1];
	}
	return [p1, p2];
}

export default new Helpers();