... if user is in local storage but not found in backend, page will still be clickable.

loader should have a timeout

payment type needs select style input

_refresh function in zussys

authwrapper is clunky... this should.... idk. needs better organization ...

needs invoice numbering system

on loggin, user fires 3..4 times, make this only fire once.

logout and user storage is spotty / clunky.

some on delete functions dont refresh with new data, make the app fetch single pages instead of using the ... master list they come from. 

PLOP might be outdated. 

selected item pages should have a backfall if nothing is found.

should invoice... be its own table..? invoice status? since there is a appointment status... idk.

prettier table for all appointment views. --> creation of a sub table component in library??

appointment on create needs fixing
appointment needs an upate modal to change status
appointment needs a ... ticket detail table. --> appointmentsTicketDetail

STATUS... across invoicing and order completion may need some .... union. if one is changed to cancelled it should cancel the other as well. 

stripe need finalizing.

needs AWS SMS sytstem to fire off emails of invoices and stripe payments, sending quote, ect. 

tickets need a status at the top of the page. should have color indicators. 

might want to lock state (tickets, invoiceing) after a certain state is reached (cancelled, fufuilled).

tickets might need comments. ... lol. v??? diff version dude.

tables need some type of format function

TABLE COMPONENT has now gotten more complex. needs.... some type of.... functions config. appointments has different actions layouts. so do some other types..... maybe..... the detail just goes first? that might be it actually, and easier for a v1.

.. potentially make service line items "completable" this can then be counted along with appointments to track progress to leverage against status states.
