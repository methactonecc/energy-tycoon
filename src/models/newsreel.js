/**
 * This is a stack of news items; when a new news item is activated, it jumps to the top of the stack, and when one is removed, it's taken away from the stack.
 * This is NOT the same as the NewsItems enum (that has ALL news items, this just has a few)
 * Use last() to get the most recent item, first() to get the very oldest item
 */
ET.NewsReel = Backbone.Collection.extend({

	model : ET.NewsItem,
	
});