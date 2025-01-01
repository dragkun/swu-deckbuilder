# Building Resource Files for Star Wars: Unlimited Deck Builder

This document describes the process of building the resource files required for the deck builder application. The process involves creating three main files: `resources.db`, `resources-1.res`, and `resources-2.res`.

## Prerequisites

- Access to card data in JSON format
- Card image resources

## Resource Files Overview

The deck builder requires three resource files, the code expects these files to be encrypted, however you can modify the code to use unencrypted files:

1. `resources-1.res`: Contains the card data information
2. `resources-2.res`: Contains the actual resource files (images)
3. `resources.db`: Contains metadata about the resources

## Building Process

### Step 1: Prepare Card Data

1. Start with a JSON file containing the full card data, see [Card Data]('./RESOURCES-1.md')

### Step 2: Prepare Resources

1. Create a directory named `resources`
2. Place all card image files in the `resources` directory
3. Image files should follow the naming convention found in the card data JSON

### Step 3: Create Resource Files

The process involves three main steps:

1. Create a resource data file that contains all images
2. Create a metadata file that tracks the location and size of each resource

#### Resource Data File Creation
- Combines all resource files into a single binary file
- Creates a metadata file containing:
  - File names
  - File offsets
  - File lengths

## File Specifications

### resources.db
- Contains metadata about resources
- Maps filenames to their locations in `resources-2.res`
- Required for resource lookup and extraction

### resources-1.res
- Contains card data
- Includes all card information:
  - Card properties
  - Card text
  - Image references
  - Set information

### resources-2.res
- Contains binary data of all resources
- Primarily consists of card images
- Resources are stored sequentially

## Security Notes

- Resource files should be treated as read-only binary data

## Usage

The deck builder application will handle the decryption and usage of these resource files. No manual decryption or manipulation is required.

## File Structure Requirements

### Resources Directory
```
resources/
  ├── [card_image_1].png
  ├── [card_image_2].png
  └── ...
```

### Output Files
```
├── resources-1.res
├── resources-2.res
└── resources.db
```

## Important Notes

1. The resource building process is one-way
2. Resource files are required for the deck builder to function
3. Always build all three resource files together to ensure consistency

This documentation provides a high-level overview of the resource building process. The actual implementation details are intentionally omitted for security purposes.
