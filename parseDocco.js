/**
 * Parse a docco text.
 *
 * @param {String} text the text to parse
*/
function parseDocco(text){
	var sections	= [];
	// go thru each lines, to build the sections
	var lines	= text.split('\n');
	lines.forEach(function(line){
		// determine the type of last line and current line
		var lastType	= sections.length === 0 ? "none" : sections[sections.length-1].type;
		var curType	= lineIsComment(line) ? "comment" : "code"
		// create a section if needed
		if( lastType !== curType )	sections.push({	type	: curType});
		// if this is a comment, remove the header immediatly
		if( curType === "comment" )	line	= lineRemoveCommentMarkup(line);
		// get current sections
		var section	= sections[sections.length-1];
		// create text if needed
		section.text	= section.text	|| '';
		// append a line
		section.text	+= line+'\n';
	})
	// go thru each sections to htmlize it
	sections.forEach(function(section){
		if( section.type === "code" && prettyPrintOne ){
			section.html	= prettyPrintOne(section.text);
		}else if( section.type === "comment" && Showdown ){
			section.html	= new Showdown.converter().makeHtml(section.text);						
		}
	});
	return sections;

	function lineIsComment(line){
		var re		= new RegExp('^\\s*' + '//' + '\\s?')
		var matches	= line.match(re);
		return matches ? true : false;
	}
	function lineRemoveCommentMarkup(line){
		var re		= new RegExp('^\\s*' + '//' + '\\s?(.*)')
		var matches	= line.match(re);
		console.assert(matches[1])
		return matches[1];
	}
}
