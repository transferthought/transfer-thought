/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGeneration = /* GraphQL */ `
  query GetGeneration($id: ID!) {
    getGeneration(id: $id) {
      id
      prompt
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listGenerations = /* GraphQL */ `
  query ListGenerations(
    $filter: ModelGenerationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGenerations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prompt
        status
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGenerationByPrompt = /* GraphQL */ `
  query GetGenerationByPrompt(
    $prompt: String
    $sortDirection: ModelSortDirection
    $filter: ModelGenerationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getGenerationByPrompt(
      prompt: $prompt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        prompt
        status
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
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
export const listCourses = /* GraphQL */ `
  query ListCourses(
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const ownerCoursesByTitle = /* GraphQL */ `
  query OwnerCoursesByTitle(
    $owner: String
    $title: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ownerCoursesByTitle(
      owner: $owner
      title: $title
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const ownerAppsByName = /* GraphQL */ `
  query OwnerAppsByName(
    $owner: String
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAppFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ownerAppsByName(
      owner: $owner
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const ownerAppsByUpdatedAt = /* GraphQL */ `
  query OwnerAppsByUpdatedAt(
    $owner: String
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAppFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ownerAppsByUpdatedAt(
      owner: $owner
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getApp = /* GraphQL */ `
  query GetApp($appId: ID!, $type: AppTypes!) {
    getApp(appId: $appId, type: $type) {
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
export const listApps = /* GraphQL */ `
  query ListApps(
    $appId: ID
    $type: ModelStringKeyConditionInput
    $filter: ModelAppFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listApps(
      appId: $appId
      type: $type
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAppInstance = /* GraphQL */ `
  query GetAppInstance($id: ID!) {
    getAppInstance(id: $id) {
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
export const listAppInstances = /* GraphQL */ `
  query ListAppInstances(
    $filter: ModelAppInstanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAppInstances(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const instanceByAppId = /* GraphQL */ `
  query InstanceByAppId(
    $appId: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAppInstanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    instanceByAppId(
      appId: $appId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getAsset = /* GraphQL */ `
  query GetAsset($id: ID!) {
    getAsset(id: $id) {
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
export const listAssets = /* GraphQL */ `
  query ListAssets(
    $filter: ModelAssetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAssets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const ownerAssetsByName = /* GraphQL */ `
  query OwnerAssetsByName(
    $owner: String
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAssetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ownerAssetsByName(
      owner: $owner
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const ownerTagAssetsByName = /* GraphQL */ `
  query OwnerTagAssetsByName(
    $owner: String
    $tagName: ModelAssetOwnerTagAssetsByNameCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAssetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ownerTagAssetsByName(
      owner: $owner
      tagName: $tagName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const ownerAssetsByUpdatedAt = /* GraphQL */ `
  query OwnerAssetsByUpdatedAt(
    $owner: String
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAssetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ownerAssetsByUpdatedAt(
      owner: $owner
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!, $subscriptionId: String!, $createdAt: AWSDateTime!) {
    getEvent(id: $id, subscriptionId: $subscriptionId, createdAt: $createdAt) {
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
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $id: ID
    $subscriptionIdCreatedAt: ModelEventPrimaryCompositeKeyConditionInput
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listEvents(
      id: $id
      subscriptionIdCreatedAt: $subscriptionIdCreatedAt
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        subscriptionId
        name
        data
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const itemsBySubscriptionId = /* GraphQL */ `
  query ItemsBySubscriptionId(
    $subscriptionId: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    itemsBySubscriptionId(
      subscriptionId: $subscriptionId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        subscriptionId
        name
        data
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSession = /* GraphQL */ `
  query GetSession($id: ID!) {
    getSession(id: $id) {
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
export const listSessions = /* GraphQL */ `
  query ListSessions(
    $filter: ModelSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        appId
        data
        createdAt
        updatedAt
        completedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const userSessionsByAppId = /* GraphQL */ `
  query UserSessionsByAppId(
    $owner: String
    $appId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userSessionsByAppId(
      owner: $owner
      appId: $appId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        appId
        data
        createdAt
        updatedAt
        completedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const sessionsByAppId = /* GraphQL */ `
  query SessionsByAppId(
    $appId: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sessionsByAppId(
      appId: $appId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        appId
        data
        createdAt
        updatedAt
        completedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getRedirect = /* GraphQL */ `
  query GetRedirect($source: String!) {
    getRedirect(source: $source) {
      source
      destination
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listRedirects = /* GraphQL */ `
  query ListRedirects(
    $source: String
    $filter: ModelRedirectFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listRedirects(
      source: $source
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        source
        destination
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const sourceByDestination = /* GraphQL */ `
  query SourceByDestination(
    $destination: String
    $sortDirection: ModelSortDirection
    $filter: ModelRedirectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sourceByDestination(
      destination: $destination
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        source
        destination
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPage = /* GraphQL */ `
  query GetPage($id: ID!, $type: PageTypes!) {
    getPage(id: $id, type: $type) {
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
export const listPages = /* GraphQL */ `
  query ListPages(
    $id: ID
    $type: ModelStringKeyConditionInput
    $filter: ModelPageFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPages(
      id: $id
      type: $type
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        type
        title
        owner
        data
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const ownerPagesByTitle = /* GraphQL */ `
  query OwnerPagesByTitle(
    $owner: String
    $title: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ownerPagesByTitle(
      owner: $owner
      title: $title
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        title
        owner
        data
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const ownerPagesByUpdatedAt = /* GraphQL */ `
  query OwnerPagesByUpdatedAt(
    $owner: String
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ownerPagesByUpdatedAt(
      owner: $owner
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        title
        owner
        data
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPageApp = /* GraphQL */ `
  query GetPageApp($id: ID!) {
    getPageApp(id: $id) {
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
export const listPageApps = /* GraphQL */ `
  query ListPageApps(
    $filter: ModelPageAppFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPageApps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        pageId
        appId
        data
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPromoCode = /* GraphQL */ `
  query GetPromoCode($id: ID!) {
    getPromoCode(id: $id) {
      id
      isValid
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPromoCodes = /* GraphQL */ `
  query ListPromoCodes(
    $filter: ModelPromoCodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPromoCodes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isValid
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
