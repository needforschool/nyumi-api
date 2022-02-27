import { gql } from "apollo-server-core";

export default gql`
  type Success {
    success: Boolean!
  }
  type CheckoutSession {
    id: String!
  }
  type PaymentIntent {
    client_secret: String!
    status: String!
  }
  type TripDate {
    creation: String!
    start: String!
    end: String!
  }
  type TripService {
    id: ID!
    trip: ID!
    state: String!
    previousState: String!
    selectedOffer: ServiceOffer
    totalPrice: Float!
    fields: String
    service: Service!
  }
  type Trip {
    id: ID!
    user: User!
    city: City!
    services: [TripService]!
    totalPrice: Float!
    state: String!
    previousState: String!
    date: TripDate
  }
  type Step {
    id: Int!
    name: String!
    description: String!
  }
  type ServiceOffer {
    id: Int!
    name: String!
    price: Float!
    commission: Int
  }
  type Service {
    id: Int!
    name: String!
    type: String!
    description: String!
    details: String!
    thumbnailUrl: String!
    startingPrice: Float
    offers: [ServiceOffer!]
    countryVariable: Boolean!
    available: Boolean!
    price: Float!
    commission: Float!
    requiredFields: [ServiceRequiredField]!
  }
  type ServiceRequiredField {
    name: String!
    label: String!
    type: String!
    options: ServiceRequiredFieldOptions
  }
  type ServiceRequiredFieldOptions {
    values: [ServiceRequiredFieldOptionsValues]
    defaultValue: String
  }
  type ServiceRequiredFieldOptionsValues {
    name: String!
    label: String!
  }
  type Pack {
    id: Int!
    name: String!
    slug: String!
    minItems: Int!
    maxItems: Int!
    discount: String!
  }
  type Role {
    id: Int!
    name: String!
  }
  type Region {
    id: Int!
    name: String!
    code: String!
  }
  type CountryService {
    serviceId: ID!
    serviceName: String!
    price: Float!
  }
  type Country {
    id: ID!
    slug: String!
    name: String!
    iso2: String!
    iso3: String!
    long: Float!
    lat: Float!
    region: Region!
    description: String!
    thumbnailUrl: String!
    services: [CountryService]!
    createdAt: String!
  }
  type City {
    id: ID!
    country: Country
    slug: String!
    name: String!
    latitude: Float!
    longitude: Float!
  }
  type WCountryCity {
    id: ID!
    name: String!
    latitude: Float!
    longitude: Float!
  }
  type WCity {
    id: ID!
    name: String!
    state_id: ID!
    state_code: String!
    state_name: String!
    country_id: ID!
    country_code: String!
    country_name: String!
    latitude: Float!
    longitude: Float!
    wikiDataId: String!
  }
  type WTranslation {
    kr: String
    br: String
    pt: String
    nl: String
    hr: String
    fa: String
    de: String
    es: String
    fr: String
    ja: String
    it: String
    cn: String
  }
  type WTimezone {
    zoneName: String!
    gmtOffset: Int!
    gmtOffsetName: String!
    abreviation: String
    tzName: String!
  }
  type WCountry {
    id: ID!
    name: String!
    iso2: String!
    iso3: String!
    numeric_code: Int!
    phone_code: String!
    capital: String!
    currency: String!
    currency_name: String!
    currency_symbol: String!
    tld: String!
    native: String
    region: String!
    subregion: String!
    timezones: [WTimezone]!
    translations: WTranslation!
    latitude: String!
    longitude: String!
    emoji: String!
    emojiU: String!
  }
  type PromoCode {
    id: ID!
    code: String!
    active: Boolean!
    used: Int!
    discount: Float!
    expirationDate: String!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    roles: [Role]!
    firstname: String!
    lastname: String!
    tel: String!
    streetNumber: String
    streetName: String!
    zipCode: String!
    city: String!
    createdAt: String!
    authentic: Boolean!
  }
  input PromoCodeInput {
    code: String!
    active: Boolean!
    discount: Float!
    expirationDate: String!
  }
  input ServiceOfferInput {
    name: String!
    price: Float!
    commission: Int
  }
  input CountryServiceInput {
    serviceId: ID!
    serviceName: String!
    price: Float!
  }
  input RegisterInput {
    email: String!
    password: String!
    firstname: String!
    lastname: String!
    tel: String!
    streetNumber: String
    streetName: String!
    zipCode: String!
    city: String!
  }
  type Query {
    #User
    getUsers: [User]
    getCurrentUser: User
    getUserEmail(email: String): Success

    #Trip
    getTrips: [Trip]
    getTrip(tripId: ID!): Trip
    getUserTrips: [Trip]

    #Country
    getCountries(query: String): [Country]
    getRandomCountries(amount: Int!): [Country]
    getCountry(countryId: ID!): Country
    getCountryBySlug(countrySlug: String!): Country
    getCountryByIso2(iso2: String!): Country
    getCountryByIso3(iso3: String!): Country

    #City
    getCities: [City]
    getCitiesWithCountryId(countryId: ID!): [City]

    getCity(cityId: ID!): City
    getCityBySlug(slug: String!): City

    #World Countries
    getWorldCountries: [WCountry]
    getCountriesCitiesByIso2(iso2: String!): [WCountryCity]
    getWorldCities: [WCity]

    #Region
    getRegions: [Region]
    getRegion(regionId: ID!): Region
    getRegionByCode(regionCode: String!): Region

    #Role
    getRoles: [Role]
    getRole(roleId: Int!): Role
    getRoleByName(roleName: String!): Role

    #Pack
    getPacks: [Pack]
    getPack(packId: ID!): Pack
    getPackBySlug(packSlug: String!): Pack

    #Service
    getServices(
      countryIso2: String
      checkInDate: String
      checkOutDate: String
    ): [Service]
    getService(serviceId: ID!): Service
    getServiceByType(serviceType: String!): Service
    getCountryVariableServices: [Service]!
    getVariableServicesPrices(
      countryIso2: String!
      checkInDate: String!
      checkOutDate: String!
    ): [Service]!
    getVariableServicePrice(
      serviceId: Int!
      countryIso2: String!
      checkInDate: String!
      checkOutDate: String!
    ): [Service]!

    #Step
    getSteps: [Step]
    getStep(stepId: ID!): Step

    #PromoCode
    getPromoCodes: [PromoCode!]!
    getPromoCode(promoCodeId: ID!): PromoCode!
    getPromoCodeByCode(code: String!): PromoCode!
  }
  type Mutation {
    # Checkout
    createPaymentIntent(totalAmount: Float!, currency: String!): PaymentIntent!
    createCheckoutSession(tripId: ID!, tripServicesId: [ID!]!): CheckoutSession!

    # User
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!

    updateUser(
      firstname: String
      lastname: String
      tel: String
      streetNumber: String
      streetName: String
      zipCode: String
      city: String
    ): User!

    recoverUser(email: String!): Success!
    updateUserPassword(
      email: String!
      token: String!
      password: String!
      confirmPassword: String!
    ): User!

    sendVerification: Success!
    verifyUser(token: String!): Success!

    #Trip
    createTrip(
      cityId: ID!
      services: [Int]!
      startDate: String!
      endDate: String!
    ): Trip!
    updateTrip(
      tripId: ID!
      city: ID!
      startDate: String!
      endDate: String!
      services: [ID]!
    ): Trip!
    tripSendState(tripId: ID!, transition: String!): String!
    deleteTrip(tripId: ID!): String!

    #TripService
    createTripService(
      tripId: ID!
      serviceId: Int!
      selectedOffer: String
      fields: String
      initialState: String
    ): TripService!
    updateTripService(
      tripServiceId: ID!
      selectedOffer: String
      fields: String
      stateTransition: String
    ): TripService!
    deleteTripService(tripServiceId: ID!): Boolean

    #Country
    createCountry(
      slug: String!
      name: String!
      iso2: String!
      iso3: String!
      long: String!
      lat: String!
      services: [CountryServiceInput]!
      description: String!
      thumbnailUrl: String!
      region: String!
    ): Country!
    updateCountry(
      countryId: ID!
      description: String!
      thumbnailUrl: String!
    ): Country!
    updateCountryServices(
      countryId: ID!
      services: [CountryServiceInput]!
    ): Country!
    deleteCountry(countryId: ID!): String!

    #City
    createCity(
      countryId: String!
      slug: String!
      name: String!
      latitude: Float!
      longitude: Float!
    ): City!
    updateCity(
      cityId: ID!
      countryId: String!
      slug: String!
      name: String!
    ): City!
    deleteCity(cityId: ID!): String!

    #PromoCode
    createPromoCode(promoCodeInput: PromoCodeInput): PromoCode!
    updatePromoCode(id: ID!, promoCodeInput: PromoCodeInput): PromoCode!
    deletePromoCode(promoCodeId: ID!): String
  }
`;
