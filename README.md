<h1>YouEdit</h1>
<hr><p>a hub for editors and creators to connect and work on a video</p><h2>General Information</h2>
<hr><ul>
<li>This Project was inspired from a idea discussed by @hkirat</li>
</ul><ul>
<li>Let's youtuber's upload the edited video at a click thus removing the need for strong internet connnection</li>
</ul><ul>
<li>Youtuber's generally provide their key to the editor's if they want to upload a video however they don't have access to the video to be uploaded</li>
</ul>
<p>YouEdit act's as a middleman letting the Editor submit the edited video And wait's for the approval of the user before uploading it</p><h2>Technologies Used</h2>
<hr><ul>
<li>React</li>
</ul><ul>
<li>NodeJS</li>
</ul><ul>
<li>TUS</li>
</ul><h2>Features</h2>
<hr><ul>
<li>User's can sign up as both Editor and Creator</li>
</ul><ul>
<li>Every Channel Upload require's a physical action (key press) from the user's device</li>
</ul><ul>
<li>The Upload is Resumable on all end's meaning that large video's(upwards of 256GB) can be transferred</li>
</ul><ul>
<li>Videos and Resource's can be Downloaded by the Editor to get a guidance for editing the video</li>
</ul><h5>Steps</h5><ul>
<li>Clone this repo</li>
</ul><ul>
<li>Run npm install to download all the dependencies</li>
</ul><ul>
<li>Go to backend and run the follwing files</li>
</ul><ul>
<li>
<pre><code>   1. app.js (this file set's the common backend)
</code></pre>
</li>
</ul><ul>
<li>
<pre><code>   2. serve.js (this file set's the server that send's download streams)
</code></pre>
</li>
</ul><ul>
<li>
<pre><code>   3. tus.js (this file set's the server that accept's the files through tus protocol)
</code></pre>
</li>
</ul><ul>
<li>
<pre><code>   4. youtube.js (this file upload's the file's to the youtube through it's api)
</code></pre>
</li>
</ul><h2>Project Status</h2>
<hr><p>This Project is still in Development</p><h2>Features that can be added</h2>
<hr><ul>
<li>a live chat that connect's editor and creator before hiring</li>
</ul><ul>
<li>video conferencing</li>
</ul><ul>
<li>migrating to amazon s3</li>
</ul><h2>Acknowledgement</h2>
<hr><ul>
<li>Harkirat Singh</li>
</ul>