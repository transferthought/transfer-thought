/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCourse = /* GraphQL */ `
  mutation CreateCourse(
    $input: CreateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    createCourse(input: $input, condition: $condition) {
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
export const updateCourse = /* GraphQL */ `
  mutation UpdateCourse(
    $input: UpdateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    updateCourse(input: $input, condition: $condition) {
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
export const deleteCourse = /* GraphQL */ `
  mutation DeleteCourse(
    $input: DeleteCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    deleteCourse(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const deleteApp = /* GraphQL */ `
  mutation DeleteApp(
    $input: DeleteAppInput!
    $condition: ModelAppConditionInput
  ) {
    deleteApp(input: $input, condition: $condition) {
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
export const updateAppInstance = /* GraphQL */ `
  mutation UpdateAppInstance(
    $input: UpdateAppInstanceInput!
    $condition: ModelAppInstanceConditionInput
  ) {
    updateAppInstance(input: $input, condition: $condition) {
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
export const deleteAppInstance = /* GraphQL */ `
  mutation DeleteAppInstance(
    $input: DeleteAppInstanceInput!
    $condition: ModelAppInstanceConditionInput
  ) {
    deleteAppInstance(input: $input, condition: $condition) {
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
export const deleteAsset = /* GraphQL */ `
  mutation DeleteAsset(
    $input: DeleteAssetInput!
    $condition: ModelAssetConditionInput
  ) {
    deleteAsset(input: $input, condition: $condition) {
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
export const updateSession = /* GraphQL */ `
  mutation UpdateSession(
    $input: UpdateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    updateSession(input: $input, condition: $condition) {
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
export const deleteSession = /* GraphQL */ `
  mutation DeleteSession(
    $input: DeleteSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    deleteSession(input: $input, condition: $condition) {
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
export const createGeneration = /* GraphQL */ `
  mutation CreateGeneration(
    $input: CreateGenerationInput!
    $condition: ModelGenerationConditionInput
  ) {
    createGeneration(input: $input, condition: $condition) {
      id
      prompt
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateGeneration = /* GraphQL */ `
  mutation UpdateGeneration(
    $input: UpdateGenerationInput!
    $condition: ModelGenerationConditionInput
  ) {
    updateGeneration(input: $input, condition: $condition) {
      id
      prompt
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteGeneration = /* GraphQL */ `
  mutation DeleteGeneration(
    $input: DeleteGenerationInput!
    $condition: ModelGenerationConditionInput
  ) {
    deleteGeneration(input: $input, condition: $condition) {
      id
      prompt
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createRedirect = /* GraphQL */ `
  mutation CreateRedirect(
    $input: CreateRedirectInput!
    $condition: ModelRedirectConditionInput
  ) {
    createRedirect(input: $input, condition: $condition) {
      source
      destination
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateRedirect = /* GraphQL */ `
  mutation UpdateRedirect(
    $input: UpdateRedirectInput!
    $condition: ModelRedirectConditionInput
  ) {
    updateRedirect(input: $input, condition: $condition) {
      source
      destination
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteRedirect = /* GraphQL */ `
  mutation DeleteRedirect(
    $input: DeleteRedirectInput!
    $condition: ModelRedirectConditionInput
  ) {
    deleteRedirect(input: $input, condition: $condition) {
      source
      destination
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createPage = /* GraphQL */ `
  mutation CreatePage(
    $input: CreatePageInput!
    $condition: ModelPageConditionInput
  ) {
    createPage(input: $input, condition: $condition) {
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
export const updatePage = /* GraphQL */ `
  mutation UpdatePage(
    $input: UpdatePageInput!
    $condition: ModelPageConditionInput
  ) {
    updatePage(input: $input, condition: $condition) {
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
export const deletePage = /* GraphQL */ `
  mutation DeletePage(
    $input: DeletePageInput!
    $condition: ModelPageConditionInput
  ) {
    deletePage(input: $input, condition: $condition) {
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
export const createPageApp = /* GraphQL */ `
  mutation CreatePageApp(
    $input: CreatePageAppInput!
    $condition: ModelPageAppConditionInput
  ) {
    createPageApp(input: $input, condition: $condition) {
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
export const updatePageApp = /* GraphQL */ `
  mutation UpdatePageApp(
    $input: UpdatePageAppInput!
    $condition: ModelPageAppConditionInput
  ) {
    updatePageApp(input: $input, condition: $condition) {
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
export const deletePageApp = /* GraphQL */ `
  mutation DeletePageApp(
    $input: DeletePageAppInput!
    $condition: ModelPageAppConditionInput
  ) {
    deletePageApp(input: $input, condition: $condition) {
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
export const createPromoCode = /* GraphQL */ `
  mutation CreatePromoCode(
    $input: CreatePromoCodeInput!
    $condition: ModelPromoCodeConditionInput
  ) {
    createPromoCode(input: $input, condition: $condition) {
      id
      isValid
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePromoCode = /* GraphQL */ `
  mutation DeletePromoCode(
    $input: DeletePromoCodeInput!
    $condition: ModelPromoCodeConditionInput
  ) {
    deletePromoCode(input: $input, condition: $condition) {
      id
      isValid
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const createApp = /* GraphQL */ `
  mutation CreateApp(
    $input: CreateAppInput!
    $condition: ModelAppConditionInput
  ) {
    createApp(input: $input, condition: $condition) {
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
export const updateApp = /* GraphQL */ `
  mutation UpdateApp(
    $input: UpdateAppInput!
    $condition: ModelAppConditionInput
  ) {
    updateApp(input: $input, condition: $condition) {
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
export const createAppInstance = /* GraphQL */ `
  mutation CreateAppInstance(
    $input: CreateAppInstanceInput!
    $condition: ModelAppInstanceConditionInput
  ) {
    createAppInstance(input: $input, condition: $condition) {
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
export const createAsset = /* GraphQL */ `
  mutation CreateAsset(
    $input: CreateAssetInput!
    $condition: ModelAssetConditionInput
  ) {
    createAsset(input: $input, condition: $condition) {
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
export const updateAsset = /* GraphQL */ `
  mutation UpdateAsset(
    $input: UpdateAssetInput!
    $condition: ModelAssetConditionInput
  ) {
    updateAsset(input: $input, condition: $condition) {
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
export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
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
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
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
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
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
export const createSession = /* GraphQL */ `
  mutation CreateSession(
    $input: CreateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    createSession(input: $input, condition: $condition) {
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
export const updatePromoCode = /* GraphQL */ `
  mutation UpdatePromoCode(
    $input: UpdatePromoCodeInput!
    $condition: ModelPromoCodeConditionInput
  ) {
    updatePromoCode(input: $input, condition: $condition) {
      id
      isValid
      createdAt
      updatedAt
      __typename
    }
  }
`;
