const statusCodes = [
    // 1xx - Informational
    {
        code: 100,
        name: "Continue",
        description: "The server has received the request headers and the client should proceed to send the request body.",
        message: "Don't stop now! I'm just getting warmed up. Keep that data flowing!",
        official: true,
        class: "1xx",
        source: "IETF"
    },
    {
        code: 101,
        name: "Switching Protocols",
        description: "The requester has asked the server to switch protocols and the server has agreed to do so.",
        message: "Switching hats! Give me a sec to change into my fancy protocol outfit!",
        official: true,
        class: "1xx",
        source: "IETF"
    },
    {
        code: 102,
        name: "Processing",
        description: "A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request.",
        message: "Hold your horses! I'm juggling all your requests like a digital circus performer!",
        official: true,
        class: "1xx",
        source: "IETF"
    },
    {
        code: 103,
        name: "Checkpoint",
        description: "Used in the resumable requests proposal to resume aborted PUT or POST requests.",
        message: "Checkpoint reached! We've saved your progress like a digital bookmark!",
        official: false,
        class: "1xx",
        source: "IETF"
    },
    {
        code: 103,
        name: "Early Hints",
        description: "Used to return some response headers before final HTTP message.",
        message: "Psst! Spoiler alert! Here's a sneak peek of what I'm about to send you!",
        official: true,
        class: "1xx",
        source: "IETF"
    },

    // 2xx - Success
    {
        code: 200,
        name: "OK",
        description: "Standard response for successful HTTP requests.",
        message: "Ta-da! Your request worked like a charm. Gold star for you!",
        official: true,
        class: "2xx",
        source: "IETF"
    },
    {
        code: 201,
        name: "Created",
        description: "The request has been fulfilled, resulting in the creation of a new resource.",
        message: "It's a boy! I've successfully delivered your new digital bundle of joy!",
        official: true,
        class: "2xx",
        source: "IETF"
    },
    {
        code: 202,
        name: "Accepted",
        description: "The request has been accepted for processing, but the processing has not been completed.",
        message: "Your request is in my to-do list. I promise I'll get to it after my coffee break!",
        official: true,
        class: "2xx",
        source: "IETF"
    },
    {
        code: 203,
        name: "Non-Authoritative Information",
        description: "The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version of the origin's response.",
        message: "I heard it through the grapevine, so take it with a grain of salt!",
        official: true,
        class: "2xx",
        source: "IETF"
    },
    {
        code: 204,
        name: "No Content",
        description: "The server successfully processed the request, but is not returning any content.",
        message: "Mission accomplished! But... I got nothin' for ya. Just silence. Sweet, digital silence.",
        official: true,
        class: "2xx",
        source: "IETF"
    },
    {
        code: 205,
        name: "Reset Content",
        description: "The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.",
        message: "Clear the slate! Time for a fresh start with a blank canvas!",
        official: true,
        class: "2xx",
        source: "IETF"
    },
    {
        code: 206,
        name: "Partial Content",
        description: "The server is delivering only part of the resource due to a range header sent by the client.",
        message: "Here's just a slice of the pie, exactly as ordered!",
        official: true,
        class: "2xx",
        source: "IETF"
    },
    {
        code: 207,
        name: "Multi-Status",
        description: "The message body that follows is an XML message and can contain a number of separate response codes.",
        message: "It's complicated! Here's a mixed bag of results for your various requests!",
        official: true,
        class: "2xx",
        source: "IETF"
    },
    {
        code: 208,
        name: "Already Reported",
        description: "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response.",
        message: "Déjà vu! I already told you about this in my previous response!",
        official: true,
        class: "2xx",
        source: "IETF"
    },
    {
        code: 226,
        name: "IM Used",
        description: "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.",
        message: "I waved my digital wand and transformed your content just the way you asked!",
        official: true,
        class: "2xx",
        source: "IETF"
    },
    {
        code: 218,
        name: "This is fine",
        description: "Apache web server extension used as an easter egg. Returns a 218 status code with a 🐶 image.",
        message: "This is fine! 🔥🐶🔥",
        official: false,
        class: "2xx",
        source: "Apache"
    },

    // 3xx - Redirection
    {
        code: 300,
        name: "Multiple Choices",
        description: "Indicates multiple options for the resource from which the client may choose.",
        message: "Pick your poison! I've got several flavors of this content for you to choose from!",
        official: true,
        class: "3xx",
        source: "IETF"
    },
    {
        code: 301,
        name: "Moved Permanently",
        description: "This and all future requests should be directed to the given URI.",
        message: "We've packed up and moved! Please update your address book—our new home is permanent!",
        official: true,
        class: "3xx",
        source: "IETF"
    },
    {
        code: 302,
        name: "Found",
        description: "Tells the client to look at another URL.",
        message: "Not here! Try next door. The content got tired of this address and went for a walk!",
        official: true,
        class: "3xx",
        source: "IETF"
    },
    {
        code: 303,
        name: "See Other",
        description: "The response to the request can be found under another URI using the GET method.",
        message: "Wrong door! The party you're looking for is happening over at that other URL!",
        official: true,
        class: "3xx",
        source: "IETF"
    },
    {
        code: 304,
        name: "Not Modified",
        description: "Indicates that the resource has not been modified since the version specified by the request headers.",
        message: "Nothing new under the sun! Your cached copy is as fresh as my new one!",
        official: true,
        class: "3xx",
        source: "IETF"
    },
    {
        code: 305,
        name: "Use Proxy",
        description: "The requested resource is available only through a proxy, the address for which is provided in the response.",
        message: "Sorry, I'm shy! You'll have to talk to me through my proxy friend over there.",
        official: true,
        class: "3xx",
        source: "IETF"
    },
    {
        code: 306,
        name: "Switch Proxy",
        description: "No longer used. Originally meant 'Subsequent requests should use the specified proxy.'",
        message: "This code is so retro it's gone out of style! Nobody uses 306 anymore!",
        official: false,
        class: "3xx",
        source: "IETF"
    },
    {
        code: 307,
        name: "Temporary Redirect",
        description: "The request should be repeated with another URI, but future requests should still use the original URI.",
        message: "Content is on vacation at this other URL! But it'll be back home soon, so keep this address!",
        official: true,
        class: "3xx",
        source: "IETF"
    },
    {
        code: 308,
        name: "Permanent Redirect",
        description: "The request and all future requests should be repeated using another URI.",
        message: "We've eloped! The content and its new URL are now happily married forever!",
        official: true,
        class: "3xx",
        source: "IETF"
    },

    // 4xx - Client Error
    {
        code: 400,
        name: "Bad Request",
        description: "The server cannot or will not process the request due to an apparent client error.",
        message: "What kind of gibberish is this? I need complete sentences, not digital hiccups!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 401,
        name: "Unauthorized",
        description: "Authentication is required and has failed or has not yet been provided.",
        message: "Halt! Who goes there? Friend or foe? Identify yourself with proper credentials!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 402,
        name: "Payment Required",
        description: "Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme.",
        message: "Please insert cash or select payment type. *Walmart self-checkout voice intensifies*",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 403,
        name: "Forbidden",
        description: "The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource.",
        message: "Nice try, but this area is VIP only! Your name's not on the list.",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 404,
        name: "Not Found",
        description: "The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.",
        message: "Houston, we have a problem. That page has vanished into the digital void!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 405,
        name: "Method Not Allowed",
        description: "A request method is not supported for the requested resource.",
        message: "That's like trying to open a banana with a chainsaw! Wrong tool for the job!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 406,
        name: "Not Acceptable",
        description: "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.",
        message: "I can't serve what you ordered! It's like asking for a veggie burger at a steakhouse!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 407,
        name: "Proxy Authentication Required",
        description: "The client must first authenticate itself with the proxy.",
        message: "The bouncer at Club Proxy needs to see your ID before letting you in!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 408,
        name: "Request Timeout",
        description: "The server timed out waiting for the request.",
        message: "Zzzz... Oh! Sorry, I fell asleep waiting for your request to finish.",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 409,
        name: "Conflict",
        description: "Indicates that the request could not be processed because of conflict in the request.",
        message: "Your request is having an identity crisis! It's conflicting with reality!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 410,
        name: "Gone",
        description: "Indicates that the resource requested is no longer available and will not be available again.",
        message: "I don't think that boomerang is coming back, nor is this page...",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 411,
        name: "Length Required",
        description: "The request did not specify the length of its content, which is required by the requested resource.",
        message: "How long is this going to be? I need measurements before we proceed!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 412,
        name: "Precondition Failed",
        description: "The server does not meet one of the preconditions that the requester put on the request.",
        message: "Your request's wishful thinking doesn't match reality. Back to the drawing board!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 413,
        name: "Payload Too Large",
        description: "The request is larger than the server is willing or able to process.",
        message: "OH GOD HELP IT IS TOO HEAVY!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 414,
        name: "URI Too Long",
        description: "The URI provided was too long for the server to process.",
        message: "That URL is longer than a CVS receipt! It's so long it might reach the moon or even Mars! Can we get a shortened version please?",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 415,
        name: "Unsupported Media Type",
        description: "The request entity has a media type which the server or resource does not support.",
        message: "I can't digest this exotic format! My digital stomach only handles certain file types!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 416,
        name: "Range Not Satisfiable",
        description: "The client has asked for a portion of the file, but the server cannot supply that portion.",
        message: "You're asking for slices of a pie that doesn't exist in those dimensions!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 417,
        name: "Expectation Failed",
        description: "The server cannot meet the requirements of the Expect request-header field.",
        message: "Your expectations are way too high! I can't live up to your standards!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 418,
        name: "I'm a teapot",
        description: "The server refuses the attempt to brew coffee with a teapot.",
        message: "I may be small and stout, but I'm a TEAPOT, not a coffee machine! The audacity!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 421,
        name: "Misdirected Request",
        description: "The request was directed at a server that is not able to produce a response.",
        message: "Wrong address! That's like delivering mail to a dog house instead of a post office!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 422,
        name: "Unprocessable Entity",
        description: "The request was well-formed but was unable to be followed due to semantic errors.",
        message: "Your request passed spelling class but flunked logic! It makes no actual sense!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 423,
        name: "Locked",
        description: "The resource that is being accessed is locked.",
        message: "This resource is locked up tighter than Fort Knox! Try again when it's unlocked!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 424,
        name: "Failed Dependency",
        description: "The request failed because it depended on another request and that request failed.",
        message: "Your request was a house of cards, and the foundation just collapsed!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 425,
        name: "Too Early",
        description: "Indicates that the server is unwilling to risk processing a request that might be replayed.",
        message: "Easy tiger! You're too early to the party! The server isn't ready for this request yet!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 426,
        name: "Upgrade Required",
        description: "The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.",
        message: "Your protocol is so outdated, it's practically ancient history! Time for an upgrade!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 428,
        name: "Precondition Required",
        description: "The origin server requires the request to be conditional.",
        message: "I need some conditions! This isn't an unconditional love kind of situation!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 429,
        name: "Too Many Requests",
        description: "The user has sent too many requests in a given amount of time.",
        message: "STOP! STOP! *dodges tomato requests* I can only handle so many at once! *gets hit by another request* MY SERVER SHIRT IS RUINED!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 431,
        name: "Request Header Fields Too Large",
        description: "The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.",
        message: "Your headers are on steroids! They're too buff for my poor server to handle!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 451,
        name: "Unavailable For Legal Reasons",
        description: "A server operator has received a legal demand to deny access to a resource or to a set of resources.",
        message: "The lawyers said no! This content has been sent to digital jail!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 430,
        name: "Request Header Fields Too Large",
        description: "An unofficial status code used by Shopify.",
        message: "Your headers are so fat they can't fit through the digital door! Slim them down please!",
        official: false,
        class: "4xx",
        source: "Shopify"
    },
    {
        code: 434,
        name: "Unknown Unicode",
        description: "Occurs when the user's request contains Unicode characters that are not supported or may cause the system to malfunction.",
        message: "Your fancy characters broke my parser! I can only handle boring ASCII, not these exotic symbols!",
        official: false,
        class: "4xx",
        source: "Creator"
    },
    {
        code: 450,
        name: "Blocked by Windows Parental Controls",
        description: "A Microsoft extension. This error is given when Windows Parental Controls are turned on and are blocking access to the given webpage.",
        message: "Daddy Microsoft says no! This content has been grounded by parental controls!",
        official: false,
        class: "4xx",
        source: "Microsoft"
    },
    {
        code: 498,
        name: "Invalid Token",
        description: "Returned by ArcGIS for Server. Code 498 indicates an expired or otherwise invalid token.",
        message: "Your token is as valid as a counterfeit dollar! Get a legit one and try again!",
        official: false,
        class: "4xx",
        source: "ArcGIS"
    },
    {
        code: 499,
        name: "Token Required / Client Closed Request",
        description: "Used by some APIs to indicate that a token is required but was not submitted. Also used by nginx to indicate that the client closed the connection.",
        message: "No token, no entry! Or did you just hang up on me? That's rude!",
        official: false,
        class: "4xx",
        source: "Nginx"
    },
    {
        code: 419,
        name: "Page Expired",
        description: "Used by the Laravel Framework when a CSRF Token is missing or expired.",
        message: "This form is older than my grandma's cookies! It's expired, please refresh!",
        official: false,
        class: "4xx",
        source: "Laravel"
    },
    {
        code: 420,
        name: "Method Failure / Enhance Your Calm",
        description: "Twitter used this to indicate that you were being rate limited.",
        message: "Enhance your calm! You're making too many requests. Take a deep breath.",
        official: false,
        class: "4xx",
        source: "Twitter"
    },
    {
        code: 426,
        name: "Upgrade Required",
        description: "The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.",
        message: "Your protocol is so last season! Upgrade to this year's fashion!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 428,
        name: "Precondition Required",
        description: "The origin server requires the request to be conditional.",
        message: "I need some conditions! No unconditional requests allowed in this establishment!",
        official: true,
        class: "4xx",
        source: "IETF"
    },
    {
        code: 460,
        name: "Captcha Required",
        description: "The request requires user interaction with a CAPTCHA verification before it can be processed.",
        message: "Please prove you're not a robot by selecting all the traffic lights in this image... Wait, are you actually a robot?",
        official: false,
        class: "4xx",
        source: "Unknown"
    },
    {
        code: 461,
        name: "Unsupported Region",
        description: "The request was made from a geographic region that is not supported by the service.",
        message: "Your digital passport isn't valid here! This content doesn't have a visa for your region!",
        official: false,
        class: "4xx",
        source: "Creator"
    },
    {
        code: 462,
        name: "Rate Limited By Time Of Day",
        description: "Request rejected because it was made during peak hours when rate limiting is stricter.",
        message: "It's rush hour on the information superhighway! Come back during the digital off-peak hours!",
        official: false,
        class: "4xx",
        source: "Creator"
    },
    {
        code: 563,
        name: "Configuration Conflict",
        description: "The server's current configuration conflicts with the requirements of the request.",
        message: "My settings are having a civil war over your request! The configuration factions can't agree!",
        official: false,
        class: "5xx",
        source: "Unknown"
    },
    {
        code: 564,
        name: "Connection Interruption",
        description: "The client's internet connection changed or was interrupted during the request processing.",
        message: "Whoops! Your internet connection just did the digital equivalent of tripping over its own shoelaces! Wi-Fi musical chairs is not a game servers enjoy!",
        official: false,
        class: "5xx",
        source: "Unknown"
    },
    {
        code: 555,
        name: "Error Handler Error",
        description: "An error occurred while the server was trying to handle another error.",
        message: "Yo dawg, I heard you like errors, so I put an error in your error handler so you can get errors while you're handling errors!",
        official: false,
        class: "5xx",
        source: "Creator"
    },
    {
        code: 566,
        name: "Peter Griffin Error",
        description: "Peter Griffin from Family Guy somehow got access to the server and broke everything.",
        message: "Hehehehehe, sorry guys! I was just trying to download more RAM and I accidentally the whole server!",
        official: false,
        class: "9xx",
        source: "Creator"
    },

    // 5xx - Server Error
    {
        code: 500,
        name: "Internal Server Error",
        description: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.",
        message: "My brain just blue-screened. Please stand by while I reboot my last two brain cells.",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 501,
        name: "Not Implemented",
        description: "The server either does not recognize the request method, or it lacks the ability to fulfil the request.",
        message: "I have no idea how to do that! It's like asking a fish to climb a tree!",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 502,
        name: "Bad Gateway",
        description: "The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
        message: "I asked my server friend for help and got back gibberish! What is wrong with them?!",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 503,
        name: "Service Unavailable",
        description: "The server is currently unavailable (because it is overloaded or down for maintenance).",
        message: "Sorry, I'm taking a spa day. Self-care is important, even for servers!",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 504,
        name: "Gateway Timeout",
        description: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
        message: "My server colleague is ghosting me! I've been waiting forever for their response!",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 505,
        name: "HTTP Version Not Supported",
        description: "The server does not support the HTTP protocol version used in the request.",
        message: "Your HTTP version belongs in a museum! I only speak modern HTTP dialects!",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 506,
        name: "Variant Also Negotiates",
        description: "Transparent content negotiation for the request results in a circular reference.",
        message: "We're stuck in a negotiation loop! It's like a digital dog chasing its own tail!",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 507,
        name: "Insufficient Storage",
        description: "The server is unable to store the representation needed to complete the request.",
        message: "My digital closet is stuffed to the brim! No room for your data!",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 508,
        name: "Loop Detected",
        description: "The server detected an infinite loop while processing the request.",
        message: "Help! I'm trapped in an infinite loop! Make it stop! Make it stop! Make it stop!",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 510,
        name: "Not Extended",
        description: "Further extensions to the request are required for the server to fulfil it.",
        message: "Your request needs more extensions! It's like a house that needs more rooms!",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 511,
        name: "Network Authentication Required",
        description: "The client needs to authenticate to gain network access.",
        message: "The network bouncer needs to see your digital ID before letting you party with us!",
        official: true,
        class: "5xx",
        source: "IETF"
    },
    {
        code: 509,
        name: "Bandwidth Limit Exceeded",
        description: "The server has exceeded the bandwidth specified by the server administrator.",
        message: "We've blown through our data cap! It's like a digital diet that failed spectacularly!",
        official: false,
        class: "5xx",
        source: "Apache"
    },
    {
        code: 520,
        name: "Unknown Error",
        description: "Used by Cloudflare when an unknown error occurred in the server.",
        message: "Something mysterious happened! Even the server is confused about what went wrong!",
        official: false,
        class: "5xx",
        source: "Cloudflare"
    },
    {
        code: 521,
        name: "Web Server Is Down",
        description: "Used by Cloudflare when the origin web server is down.",
        message: "The web server has called in sick today! It might have digital flu!",
        official: false,
        class: "5xx",
        source: "Cloudflare"
    },
    {
        code: 522,
        name: "Connection Timed Out",
        description: "Used by Cloudflare when a connection to the origin web server timed out.",
        message: "The server is playing hide and seek, but forgot to come out of hiding!",
        official: false,
        class: "5xx",
        source: "Cloudflare"
    },
    {
        code: 523,
        name: "Origin Is Unreachable",
        description: "Used by Cloudflare when the origin web server is unreachable.",
        message: "The origin server has left the building! It's gone without leaving a forwarding address!",
        official: false,
        class: "5xx",
        source: "Cloudflare"
    },
    {
        code: 524,
        name: "A Timeout Occurred",
        description: "Used by Cloudflare when a timeout occurred during processing the request.",
        message: "The server fell asleep on the job! Someone poke it with a digital stick!",
        official: false,
        class: "5xx",
        source: "Cloudflare"
    },
    {
        code: 525,
        name: "SSL Handshake Failed",
        description: "Used by Cloudflare when the SSL handshake between Cloudflare and the origin failed.",
        message: "The SSL handshake was awkward and failed! It's like a digital date that went terribly wrong!",
        official: false,
        class: "5xx",
        source: "Cloudflare"
    },
    {
        code: 526,
        name: "Invalid SSL Certificate",
        description: "Used by Cloudflare when the origin web server's SSL certificate is invalid.",
        message: "Your SSL certificate is faker than a $3 bill! Get a legitimate one and try again!",
        official: false,
        class: "5xx",
        source: "Cloudflare"
    },
    {
        code: 527,
        name: "Railgun Error",
        description: "Used by Cloudflare when a Railgun connection failed.",
        message: "The Railgun has derailed! Our speedy connection service has hit a digital pothole!",
        official: false,
        class: "5xx",
        source: "Cloudflare"
    },
    {
        code: 530,
        name: "Origin DNS Error",
        description: "Used by Cloudflare to indicate a problem with the origin server's DNS.",
        message: "DNS? More like 'Did Not Show'! The origin's address is missing in action!",
        official: false,
        class: "5xx",
        source: "Cloudflare"
    },
    {
        code: 598,
        name: "Network Read Timeout Error",
        description: "Used by some HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.",
        message: "The data pipeline is clogged! Information is trickling slower than molasses in winter!",
        official: false,
        class: "5xx",
        source: "Unknown"
    },
    {
        code: 599,
        name: "Network Connect Timeout Error",
        description: "An error used by some HTTP proxies to signal a network connect timeout behind the proxy to a client in front of the proxy.",
        message: "Connection timed out faster than my patience with slow Wi-Fi! Maybe try again?",
        official: false,
        class: "5xx",
        source: "Unknown"
    },
    {
        code: 561,
        name: "Depleted Resources",
        description: "Server has temporarily run out of specific resources needed to complete the request.",
        message: "I'm running on fumes here! My digital gas tank is empty and I need a resource refill!",
        official: false,
        class: "5xx",
        source: "Unknown"
    },
    {
        code: 562,
        name: "Regulatory Compliance Error",
        description: "The server is unable to process the request due to regulatory requirements or compliance issues.",
        message: "The regulatory overlords have spoken! This operation violates our digital compliance rules!",
        official: false,
        class: "5xx",
        source: "Unknown"
    },
    {
        code: 563,
        name: "Configuration Conflict",
        description: "The server's current configuration conflicts with the requirements of the request.",
        message: "My settings are having a civil war over your request! The configuration factions can't agree!",
        official: false,
        class: "5xx",
        source: "Unknown"
    },
    // Unofficial and non-standard status codes
    {
        code: 666,
        name: "Demon Found",
        description: "A playful/joke HTTP status code; sometimes used to indicate an evil/malicious code or script.",
        message: "Exorcism needed! Digital demons have possessed this request! The power of Christ compels you!",
        official: false,
        class: "9xx",
        source: "Creator"
    },
    {
        code: 701,
        name: "Meh",
        description: "An unofficial humorous code implying a feeling of apathy about the request.",
        message: "Meh, I guess I'll process your request... if I feel like it.",
        official: false,
        class: "9xx",
        source: "Creator"
    },
    {
        code: 777,
        name: "Jackpot",
        description: "An imaginary HTTP status code, similar to a slot machine jackpot.",
        message: "💰 JACKPOT! 💰 You've hit the lucky request number! 💰",
        official: false,
        class: "9xx",
        source: "Creator"
    },
    {
        code: 999,
        name: "Major Outage",
        description: "Used by some monitoring services to indicate a major system outage.",
        message: "MAYDAY! MAYDAY! The digital ship is sinking! Women and children processes first!",
        official: false,
        class: "9xx",
        source: "Creator"
    }
];