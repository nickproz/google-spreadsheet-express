# google-spreadsheet-express-routes
A simple API for interacting with a google spreadsheet. Import these routes into an existing node express server to
expose them. Below is an example:

```javascript 1.8
// Initialize our Express app
let app = express();

// Initialize our routes on the app
require('google-spreadsheet-express-routes')(app);
```

## Create necessary (free) Google accounts:
* Create a Google Cloud Platform Project [here](https://console.cloud.google.com/home/dashboard)
* Create a Google Service account within your project [here](https://console.cloud.google.com/iam-admin/serviceaccounts) 
* Create a private key for your Google Service account
    * On the newly created service account page, click the `Create Key` at the bottom, and choose `JSON` to download the key
* Add the correct credentials to the `.env` file in the root of the project (or, if deploying to Heroku, add these to the `Config Vars` for the application)
    * **GOOGLE_SHEETS_PROJECT_ID**: The `project_id` field in the JSON key created above
    * **GOOGLE_SHEETS_PRIVATE_KEY**: The `private_key` field in the JSON key created above
    * **GOOGLE_SHEETS_PRIVATE_KEY_ID**: The `private_key_id` field in the JSON key created above 
    * **GOOGLE_SHEETS_CLIENT_EMAIL**: The `client_email` field in the JSON key created above
    * **GOOGLE_SHEETS_CLIENT_ID**: The `client_id` field in the JSON key created above
    * **GOOGLE_SHEETS_CERT_URL**: The `client_x509_cert_url` field in the JSON key created above
    
## Share spreadsheet with Google Service account
To be able to write/read to/from the spreadsheet, you need to share the spreadsheet with the created Google Service
account above. To do this, just click `Share` from the spreadsheet and add the `client_email` of the service account
(see how to find that above). Ensure you only share permissions that you want the service account to have (only view
permissions if you only plan on reading from the spreadsheet and don't want anyone to be able to manipulate it, or
view + edit permissions if you want to be able to manipulate the spreadsheet).

## TODO:  
* Add endpoints: create/modify/delete sheet, get/update cell, delete row

## API Documentation

## Get Spreadsheet Info

Gets information about the entire spreadsheet.

### Usage

**URL** : `/sheets/:sheetId`

**Method** : `GET`

**Parameters** : 
* **:sheetId** = The ID of the spreadsheet (can be found in the spreadsheet url (after /d/ and before /edit))

### Success Response
 
**Condition** : Sheet ID provided is valid and spreadsheet has been shared with the Google service account.

**Code** : `200 OK`

**Content example** :
```json
{
    "id": "https://spreadsheets.google.com/feeds/worksheets/:sheetId/private/full",
    "title": "Spreadsheet Title",
    "updated": "2018-02-12T03:13:12.451Z",
    "author": {
        "name": "nick.prozorovsky",
        "email": "nick.prozorovsky@gmail.com"
    },
    "worksheets": [
        {
            "url": "https://spreadsheets.google.com/feeds/worksheets/:sheetId/od6",
            "id": "od6",
            "title": "Sheet1",
            "rowCount": 1037,
            "colCount": 26,
            "_links": []
        }
    ]
}
```

### Error Response

**Condition** : If provided sheet ID was invalid, or the spreadsheet was not shared with the Google Service account.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": 400,
    "message": "Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.",
    "type": "Bad Request"
}
```

## Get Worksheet Info

Gets information about a single worksheet within a spreadsheet.

### Usage

**URL** : `/sheets/:sheetId/sheetIndex/:sheetIndex`

**Method** : `GET`

**Parameters** : 
* **:sheetId** = The ID of the spreadsheet (can be found in the spreadsheet url (after /d/ and before /edit))
* **:sheetIndex** = The index of the worksheet within the spreadsheet (starts at 0)

### Success Response
 
**Condition** : Sheet ID provided is valid and spreadsheet has been shared with the Google service account. If an
invalid sheet index has been provided, an empty 200 response will be returned

**Code** : `200 OK`

**Content example** :
```json
{
    "url": "https://spreadsheets.google.com/feeds/worksheets/:sheetId/od6",
    "id": "od6",
    "title": "Sheet1",
    "rowCount": 1037,
    "colCount": 26,
    "_links": []
}
```

### Error Response

**Condition** : If provided sheet ID was invalid, or the spreadsheet was not shared with the Google Service account.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": 400,
    "message": "Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.",
    "type": "Bad Request"
}
```

## Get Row Data

Gets row data for the row index passed in.

### Usage

**URL** : `/sheets/:sheetId/sheetIndex/:sheetIndex/rows/:rowIndex`

**Method** : `GET`

**Parameters** : 
* **:sheetId** = The ID of the spreadsheet (can be found in the spreadsheet url (after /d/ and before /edit))
* **:sheetIndex** = The index of the worksheet within the spreadsheet (starts at 0)
* **:rowIndex** = The index of the worksheet within the spreadsheet (starts at 0)

### Success Response
 
**Condition** : Sheet ID provided is valid and spreadsheet has been shared with the Google service account. If an
invalid sheet index or row index has been provided, an empty 200 response will be returned

**Code** : `200 OK`

**Content example** :
```json
{
    "headerRow1Col1":"valueRow1Col1", 
    "headerRow1Col2":"valueRow1Col2"
 }
```

### Error Response

**Condition** : If provided sheet ID was invalid, or the spreadsheet was not shared with the Google Service account.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": 400,
    "message": "Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.",
    "type": "Bad Request"
}
```

## Get All Row Data

Gets row data for the row index passed in.

### Usage

**URL** : `/sheets/:sheetId/sheetIndex/:sheetIndex/rows`

**Method** : `GET`

**Parameters** : 
* **:sheetId** = The ID of the spreadsheet (can be found in the spreadsheet url (after /d/ and before /edit))
* **:sheetIndex** = The index of the worksheet within the spreadsheet (starts at 0)

### Success Response
 
**Condition** : Sheet ID provided is valid and spreadsheet has been shared with the Google service account. If an
invalid sheet index has been provided, an empty 200 response will be returned

**Code** : `200 OK`

**Content example** :
```json
[  
    {"headerRow1Col1":"valueRow1Col1", "headerRow1Col2":"valueRow1Col2"},  
    {"headerRow2Col1":"valueRow2Col1"}  
]
```

### Error Response

**Condition** : If provided sheet ID was invalid, or the spreadsheet was not shared with the Google Service account.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": 400,
    "message": "Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.",
    "type": "Bad Request"
}
```

## Create a New Row

Creates a new row in the spreadsheet. The row is appended to the spreadsheet after all occupied rows.

### Usage

**URL** : `/sheets/:sheetId/sheetIndex/:sheetIndex/rows`

**Method** : `POST`

**Parameters** : 
* **:sheetId** = The ID of the spreadsheet (can be found in the spreadsheet url (after /d/ and before /edit))
* **:sheetIndex** = The index of the worksheet within the spreadsheet (starts at 0)

**Headers** :
* **Content-Type** : application/json

**Post Body Example** :
```json
{
  "First Name": "Nick",
  "Last Name": "Prozorovsky",
  "Dietary Restriction": "None",
  "Can Attend": "Yes"
}
```
Note: The key must match a header column name exactly to be written to that column. The value is the value to write to
that column. If an invalid key (header column name) is provided, it will be ignored and will not be written to the spreadsheet.

### Success Response
 
**Condition** : Sheet ID provided is valid and spreadsheet has been shared with the Google service account. If an
invalid sheet index has been provided, an empty 200 response will be returned

**Code** : `200 OK`

**Content example** :
```json
{
  "First Name": "Nick",
  "Last Name": "Prozorovsky",
  "Dietary Restriction": "None",
  "Can Attend": "Yes"
}
```
The created row object is returned to the user.

### Error Response

**Condition** : If provided sheet ID was invalid, or the spreadsheet was not shared with the Google Service account.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": 400,
    "message": "Please provide a valid spreadsheet ID and ensure the spreadsheet is shared with the Google Service account.",
    "type": "Bad Request"
}
```