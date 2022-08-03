import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
const url = require('url');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  const suportedImage: string[] = ['jpg', 'png', 'bmp', 'tiff', 'gif','jpeg'];

  app.get("/filteredimage/", async (req: Request, res: Response) => {
    let { image_url } = req.query;
    if (!image_url) {
      return res.status(400).send("Missing image URL.");
    }
    let parsed_url = url.parse(image_url, true);
    if (!parsed_url.protocol || !parsed_url.slashes || !parsed_url.hostname || !parsed_url.pathname) {
      return res.status(400).send("Malformed URL.");
    }
    if (suportedImage.indexOf(parsed_url.pathname.split(".")[1]) === -1) {
      return res.status(415).send("Image extension is not supported");
    }
    let filteredImageURI: string = await filterImageFromURL(image_url.toString());
    res.status(200).sendFile(filteredImageURI);
    res.on('finish', () => deleteLocalFiles([filteredImageURI]));
  });
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();