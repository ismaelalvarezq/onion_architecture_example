async function getLinks (url, totalItems) {
  var url = new URL(url);

  var offset = parseInt(url.searchParams.get("offset"));
  if (!offset) {
    offset = 0;
    url.searchParams.set("offset", "0");
  }

  var limit = parseInt(url.searchParams.get("limit"));
  if (!limit) {
    limit = 10;
    url.searchParams.set("limit", "10");
  }

  var nextUrl = new URL(url.toString());
  var previousUrl = new URL(url.toString());

  if (offset > 0) {
    var previousOffset = offset - limit;
    if (previousOffset < 0) {
      previousUrl.searchParams.set("offset", "");
    } else {
      previousUrl.searchParams.set("offset", String(previousOffset));
    }
  }

  nextUrl.searchParams.set("offset", String(offset + limit));

  var links = {
    "total_items": totalItems,
    "previous": previousUrl.toString(),
    "current": url.toString(),
    "next": nextUrl.toString(),
  };

  return links
}


module.exports = {
  getLinks
}
