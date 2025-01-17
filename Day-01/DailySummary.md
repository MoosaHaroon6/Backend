# Day-01

 <--  Libraries To Be Installed  -->

  1 => Express Js  // npm i express
  2 => one-liner-joke (optional) // npm i one-liner-joke
  3 => figlet (optional) // npm i figlet
 
 <--  Libraries To Be Installed  -->



Express Js  (Backend frameWork)

     => GET : A [GET] request is an [HTTP] method used to fetch data from a server. It is
        commonly used for retrieving information, such as database records or web page 
        content, without making any changes to the server's data.

     => POST : Secure add   


Middleware (My Explanation) : 
   => [Middleware] is a function that runs before changing the route or request.In this
      request gets jam and for pushing it the [next()] is used.  #English

   => [Middleware] wo functionality hai jo kay route change hony se phle chalta hai or request
      ko jam krdeta hai / pause krdeta hai , request ko agay chalany k lye [next()] ka function
      use hota jo apki req ko push krta hai.  #Urdu



               <---- AI-Explanation ----> 

Middleware :

        Middleware is a function that executes before the final request handler.
        It can: 
        => Modify the req or res objects.
        => End the request-response cycle.
        => Pass control to the next middleware using the next() function.

Explanation of next() :
    => When the request "gets jammed" (i.e., is waiting in middleware),
       next() is used to move it forward.
    
    => Without next(), the server will not proceed to the next middleware or
       route handler, and the request will hang.
  
               <---- AI-Explanation ----> 
       



