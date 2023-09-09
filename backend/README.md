# # BACKEND README
# Youtube 
this file set's a server to fetch the file's and upload them on youtube
 
it has following end point 
1. /login (this is a external endpoint meaning you have to call this end point with the bundle to be uploaded as a parameter
it trigger's authentication for youtube account access
)
2. /google(this end point is a callback it get's the token and call's upload)
3. /upload(this endpoint read's the file's and upload's thing's to the youtube account)


# serve
this file set's a server that stream's the data and send's the data to be downloaded

it has the following endpoint's

1. /download(this endpoint is used to downlaod a single media file when id of the media is provided)
2. /serve(this endpoint stream's the video resource to a videotag or to any one if provided the id of the media to be served)
3. /download-zip (this endpoint compresses the resource's file of a task and send's it for download when id of the task is provided)
4. /delete (this endpoint is used to delete a particular resource when media id,task id and the ownerid is provided)
5. /thumbnail (this end point is used to serve thumbnail but it is redundant as /serve it's job)

# tus

this server wrap's the express server in tus protocol thus it can accept resumable upload's

it has the following end point's

1. it by default when the request is made  a tus connection is opened and the data is uploaded
then based on what type of upload it is some change's are made to the mongodb data base according to the upload object metadata

# app
 
this is the main server that handle's some special request 
it is the ony server where  the user is serialized into a session so all request relying on a session are stored here
the authentication endpoint's are not explained here
the non authentication api are

1. /user (provide's the user object to the frontend if the user is logged in)
2. /createtask and /finishtask (create task create's a task in database return it's id to frontend then when time be finishtask is called with that id that put's the the data in user)
3. /createbundle /finishbundle (same as above)
4. /hireList (send's the frontend a list of potential  editor's)
5. /hire (hire's a particular editor based on it's googleId for a task identified through it's taskid)
