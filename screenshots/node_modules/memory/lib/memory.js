
module.exports =  memory = function(kDec, returnMBString) {
	kDec = kDec || 2;
	returnMBString = returnMBString || false;
	var memoryObj = process.memoryUsage();
	var bytes = parseInt(memoryObj.rss);
	if (bytes) {
		var MBytes = bytes / (1024*1024);
		var roundedMegabytes = Math.round(MBytes * Math.pow(10, kDec)) / Math.pow(10, kDec);
		if (returnMBString === true) {
			var MB = roundedMegabytes.toString() + " MB";
		} else {
			var MB = roundedMegabytes;
		}
		return MB;
	}
};

/* EOF */