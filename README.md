# Portal image
A REST service providing a set of image editing capabilities.

## Endpoints
**POST /api/**

Facade that allows you to 

1) store an image after doing zero, one or multiple manipulations.
2) retrieve cached images, eventually executing additional manipulations

*Form data:*

|field name | type   | required | meaning |
|-----------|--------| -------- |-----|
| image     | file   | yes      | |
| transformations   | json | no      | JSON array containing the description of the transformations you would like to apply to the image. Transformations are applied in order of occurence in this array.  |

### Transformations

*Example*
```json
[
    {
      "name": "resize", 
      "width": "500",
      "height": "400",
      "crop": "true"
    }, 
    {
      "name": "grayscale"
    }
]
```

#### Resize
Resizes the image to a desired size.

|field name | type   | required | meaning |
|-----------|--------| -------- |-----|
| width     | number   | yes      | Width in pixels. |
| height   | number | no      | Height in pixels. If no height is given, the aspect ratio of the image is respected. |
| crop   | boolean | no      | If both width and height are given, and the aspect ratio of the desired image does not match the aspect ratio of the source image, is it allowed to crop the image so that the aspect ratio can be respected? |

#### Greyscale
Turns an image into greyscale.

No options available.

## Development
### How to start the application?
`node app.js`

### How to build the Docker image?
`docker build . --tag=stainii/portal-image-editor:[version]`

### How to publish?
`docker login`
`docker push stainii/portal-image-editor:[version]`

### Release
TODO