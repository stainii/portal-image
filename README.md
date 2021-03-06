# Portal image
A REST service providing a set of image editing capabilities.

## Endpoints
### POST /api/transform
REST service with which you can
1) store an image
2) generate and store one or multiple transformations of an image
3) perform and store additional transformation on an earlier stored image 

*Form data:*

|field name | type   | required | meaning |
|-----------|--------| -------- |-----|
| image     | file   | only if imageName is not provided      | image you want to (transform and) store |
| imageName | file   | only if image is not provided      | image you want to (transform and) retrieve |
| transformationDefinitions   | json | no      | JSON object containing a description of the transformations you would like to apply to the image. See [transformations](#transformations).   |

 
**Returns:**
An object containing paths to the original version and all requested transformed images.

```json
[
    {
        "label": "original",
        "name": "7a9070e4016272e445fe11e0a73c748d4b4bad2039fbf350870a88a8b9c940d5.png"
    },
    {
        "label": "medium-grayscale",
        "name": "208d634ff4dec3952b5e9d4ae2fddf29cb8363d96add6bb7f3ac9c2bda0beaa3.png"
    },
    {
        "label": "medium",
        "name": "494e5d5bc7a20de5878bca08c84555e384959bef0edb486c69c3f5ec2f95e5a6.png"
    }
]
```

**Exceptions:**

| HTTP code | occurs when | preconditions |
|-----| ----- | ---- |
| 404 | if image with given name does not exist | only applicable when imageName is provided |

### GET /api/retrieve/{imageName}
**Returns:** Returns earlier stored image.

**Exceptions:**

| HTTP code | occurs when | preconditions |
|-----| ----- | ---- |
| 404 | if image with given name does not exist |  |

### DELETE /api/remove/{imageName}
**Returns:** 200 OK with empty body

**Exceptions:**

| HTTP code | occurs when | preconditions |
|-----| ----- | ---- |
| 404 | if image with given name does not exist |  |



## Transformations

Transformations needs to be provided as a double array.

Example:

```json
[
  {
    "label": "medium-greyscale",
    "transformations": [ 
      { "name": "resize", "width": 500, "height": 400, "crop": true }, 
      { "name": "greyscale"}
    ]
  }, {
    "label": "medium-color",
    "transformations": [ 
      { "name": "resize", "width": 500, "height": 400, "crop": true }
    ]
  }
]
```

results in 
* the original image
* a resized image in greyscale
* a resized image (in color)

```json
[
    {
        "label": "original",
        "name": "7a9070e4016272e445fe11e0a73c748d4b4bad2039fbf350870a88a8b9c940d5.png"
    },
    {
        "label": "medium-greyscale",
        "name": "208d634ff4dec3952b5e9d4ae2fddf29cb8363d96add6bb7f3ac9c2bda0beaa3.png"
    },
    {
        "label": "medium-color",
        "name": "494e5d5bc7a20de5878bca08c84555e384959bef0edb486c69c3f5ec2f95e5a6.png"
    }
]
```

### Resize
Resizes the image to a desired size.

|field name | type   | required | meaning |
|-----------|--------| -------- |-----|
| width     | number   | yes      | Width in pixels. |
| height   | number | no      | Height in pixels. If no height is given, the aspect ratio of the image is respected. |
| crop   | boolean | no      | If both width and height are given, and the aspect ratio of the desired image does not match the aspect ratio of the source image, is it allowed to crop the image so that the aspect ratio can be respected? |

### Greyscale
Turns an image's colors into greyscale.

No options available.

### Sepia
Turns an image's colors into sepia.

No options available.

## Environment variables
| Name | Example value | Description | Required? |
| ---- | ------------- | ----------- | -------- |
| EUREKA_HOST | portal-eureka | Hostname of the Eureka server | optional
| EUREKA_PORT | 8761 | Port that the Eureka server uses | optional
| EUREKA_SERVICE_PATH | /eureka/apps/ | Service path of Eureka | optional
| HOSTNAME | localhost | Hostname of the server on which this application can be reached. Used by Eureka | optional
| PORT | 3000 | Port that the Node server should use | optional
| IP_ADDRESS | 127.0.0.1 | IP address on which this application can be reached. Used by Eureka | optional

## Architecture
![Architecture](./documentation/architecture.png)

## Development
### What do I need to do to install the app locally?
1. Install Node 13+
1. `npm install`

### How to start the app locally?
`cd app; node app.js`

*The app expects the "data" folder to be located in the same folder as in which the app is booted. That's why you need to cd to the "app" folder.*

### How to build the Docker image?
`docker build . --tag=stainii/portal-image:[version]`

### How to publish?
`docker login`  
`docker push stainii/portal-image:[version]`

### Release
On the dev branch, in app folder:
1. Remove everything in the data folder
1. Set version in package.json
1. `git add package.json`
1. `git commit -m "release [version]`
1. `npm login`  
1. `npm publish --access=public`
1. `cd ..`
1. `docker build . --tag=stainii/portal-image:[version]`  
1. `docker login`
1. `docker push stainii/portal-image:[version]`    
1. `git tag [version]`
1. `git push --tags`
1. merge with the master branch