$(function(){
	$('.comment').click(function(){
		var target = $(this)
		var tid = target.data('tid')
		var commentId = target.data('cid')

		if ($('#tid').length > 0) {
			$('#tid').val(tid)
	    }
	    else {
	    	$('<input>').attr({
		        type: 'hidden',
		        id: 'tid',
		        name: 'comment[tid]',
		        value: tid
	      	}).appendTo('#commentForm')
	    }

	    if ($('#commentId').length > 0) {
	      	$('#commentId').val(commentId)
	    }
	    else {
	        $('<input>').attr({
		        type: 'hidden',
		        id: 'commentId',
		        name: 'comment[cid]',
		        value: commentId
		    }).appendTo('#commentForm')
	    }
	})
})