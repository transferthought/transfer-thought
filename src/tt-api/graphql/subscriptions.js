/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent($subscriptionId: String) {
    onCreateEvent(subscriptionId: $subscriptionId) {
      id
      subscriptionId
      name
      data
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateAsset = /* GraphQL */ `
  subscription OnCreateAsset($owner: String) {
    onCreateAsset(owner: $owner) {
      id
      parentId
      name
      tag
      fileType
      key
      owner
      isFolder
      variations
      createdAt
      updatedAt
      parent {
        id
        parentId
        name
        tag
        fileType
        key
        owner
        isFolder
        variations
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
export const onUpdateAsset = /* GraphQL */ `
  subscription OnUpdateAsset($owner: String) {
    onUpdateAsset(owner: $owner) {
      id
      parentId
      name
      tag
      fileType
      key
      owner
      isFolder
      variations
      createdAt
      updatedAt
      parent {
        id
        parentId
        name
        tag
        fileType
        key
        owner
        isFolder
        variations
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String!) {
    onCreateUser(owner: $owner) {
      id
      owner
      email
      firstName
      lastName
      autoShowTour
      plan
      unlimted
      unlimtedLifetime
      totalAllottedViews
      createdAt
      updatedAt
      totalViews
      currentMonthViews
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String!) {
    onUpdateUser(owner: $owner) {
      id
      owner
      email
      firstName
      lastName
      autoShowTour
      plan
      unlimted
      unlimtedLifetime
      totalAllottedViews
      createdAt
      updatedAt
      totalViews
      currentMonthViews
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String!) {
    onDeleteUser(owner: $owner) {
      id
      owner
      email
      firstName
      lastName
      autoShowTour
      plan
      unlimted
      unlimtedLifetime
      totalAllottedViews
      createdAt
      updatedAt
      totalViews
      currentMonthViews
      __typename
    }
  }
`;
export const onCreateGeneration = /* GraphQL */ `
  subscription OnCreateGeneration {
    onCreateGeneration {
      id
      prompt
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateGeneration = /* GraphQL */ `
  subscription OnUpdateGeneration {
    onUpdateGeneration {
      id
      prompt
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteGeneration = /* GraphQL */ `
  subscription OnDeleteGeneration {
    onDeleteGeneration {
      id
      prompt
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateCourse = /* GraphQL */ `
  subscription OnCreateCourse {
    onCreateCourse {
      id
      title
      description
      owner
      sections
      thumbnailUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateCourse = /* GraphQL */ `
  subscription OnUpdateCourse {
    onUpdateCourse {
      id
      title
      description
      owner
      sections
      thumbnailUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteCourse = /* GraphQL */ `
  subscription OnDeleteCourse {
    onDeleteCourse {
      id
      title
      description
      owner
      sections
      thumbnailUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateApp = /* GraphQL */ `
  subscription OnCreateApp {
    onCreateApp {
      appId
      type
      name
      owner
      state
      config
      actions
      thumbnailUrl
      unlimted
      unlimtedLifetime
      createdAt
      updatedAt
      totalViews
      currentMonthViews
      pages {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const onUpdateApp = /* GraphQL */ `
  subscription OnUpdateApp {
    onUpdateApp {
      appId
      type
      name
      owner
      state
      config
      actions
      thumbnailUrl
      unlimted
      unlimtedLifetime
      createdAt
      updatedAt
      totalViews
      currentMonthViews
      pages {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const onDeleteApp = /* GraphQL */ `
  subscription OnDeleteApp {
    onDeleteApp {
      appId
      type
      name
      owner
      state
      config
      actions
      thumbnailUrl
      unlimted
      unlimtedLifetime
      createdAt
      updatedAt
      totalViews
      currentMonthViews
      pages {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const onCreateAppInstance = /* GraphQL */ `
  subscription OnCreateAppInstance {
    onCreateAppInstance {
      id
      appId
      owner
      state
      config
      thumbnailUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateAppInstance = /* GraphQL */ `
  subscription OnUpdateAppInstance {
    onUpdateAppInstance {
      id
      appId
      owner
      state
      config
      thumbnailUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteAppInstance = /* GraphQL */ `
  subscription OnDeleteAppInstance {
    onDeleteAppInstance {
      id
      appId
      owner
      state
      config
      thumbnailUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateSession = /* GraphQL */ `
  subscription OnCreateSession {
    onCreateSession {
      id
      owner
      appId
      data
      createdAt
      updatedAt
      completedAt
      __typename
    }
  }
`;
export const onUpdateSession = /* GraphQL */ `
  subscription OnUpdateSession {
    onUpdateSession {
      id
      owner
      appId
      data
      createdAt
      updatedAt
      completedAt
      __typename
    }
  }
`;
export const onDeleteSession = /* GraphQL */ `
  subscription OnDeleteSession {
    onDeleteSession {
      id
      owner
      appId
      data
      createdAt
      updatedAt
      completedAt
      __typename
    }
  }
`;
export const onCreateRedirect = /* GraphQL */ `
  subscription OnCreateRedirect {
    onCreateRedirect {
      source
      destination
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateRedirect = /* GraphQL */ `
  subscription OnUpdateRedirect {
    onUpdateRedirect {
      source
      destination
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteRedirect = /* GraphQL */ `
  subscription OnDeleteRedirect {
    onDeleteRedirect {
      source
      destination
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreatePage = /* GraphQL */ `
  subscription OnCreatePage {
    onCreatePage {
      id
      type
      title
      owner
      data
      createdAt
      updatedAt
      apps {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const onUpdatePage = /* GraphQL */ `
  subscription OnUpdatePage {
    onUpdatePage {
      id
      type
      title
      owner
      data
      createdAt
      updatedAt
      apps {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const onDeletePage = /* GraphQL */ `
  subscription OnDeletePage {
    onDeletePage {
      id
      type
      title
      owner
      data
      createdAt
      updatedAt
      apps {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const onCreatePageApp = /* GraphQL */ `
  subscription OnCreatePageApp {
    onCreatePageApp {
      id
      pageId
      appId
      data
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdatePageApp = /* GraphQL */ `
  subscription OnUpdatePageApp {
    onUpdatePageApp {
      id
      pageId
      appId
      data
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeletePageApp = /* GraphQL */ `
  subscription OnDeletePageApp {
    onDeletePageApp {
      id
      pageId
      appId
      data
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
