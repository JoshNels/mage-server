import { expect } from 'chai'
import { mock, reset, instance, when, deepEqual } from 'ts-mockito'
import request from 'supertest'
import express, { Request, Response, NextFunction } from 'express'
import { SourceRepository, AdapterRepository } from '../../../plugins/mage-manifold/repositories'
import { SourceDescriptor, SourceDescriptorEntity, SourceDescriptorModel } from '../../../plugins/mage-manifold/models'
import mongoose from 'mongoose'
import { parseEntity } from '../../utils'
import { ManifoldService } from '../../../plugins/mage-manifold/services'
import { ManifoldController, createRouter } from '../../../plugins/mage-manifold'
import OgcApiFeatures from '../../../plugins/mage-manifold/ogcapi-features'
import { FeatureCollection } from 'geojson'
const log = require('../../../logger')

describe.only('manifold source routes', function() {

  const sourceBase = '/manifold/sources/abc123'
  const adapterRepoMock = mock<AdapterRepository>()
  const adapterRepo = instance(adapterRepoMock)
  const sourceRepoMock = mock<SourceRepository>()
  const sourceRepo = instance(sourceRepoMock)
  const manifoldServiceMock = mock<ManifoldService>()
  const manifoldService = instance(manifoldServiceMock)
  const featuresAdapterMock = mock<OgcApiFeatures.ServiceAdapter>()
  const featuresAdapter = instance(featuresAdapterMock)
  // TODO: workaround for https://github.com/NagRock/ts-mockito/issues/163
  ;(featuresAdapterMock as any).__tsmockitoMocker.excludedPropertyNames.push('then')
  const app = express()
  app.use(express.json())
  const injection: ManifoldController.Injection = {
    adapterRepo,
    sourceRepo,
    manifoldService
  }
  const manifold = createRouter(injection)
  app.use('/manifold', manifold)
  app.use((err: any, req: Request, res: Response, next: NextFunction): any => {
    if (err) {
      log.error(err)
    }
    next(err)
  })

  beforeEach(function() {
    reset(adapterRepoMock)
    reset(sourceRepoMock)
    reset(manifoldServiceMock)
  })

  describe('path /{sourceId}/collections', function() {

  })

  describe('path /{sourceId}/collections/{collectionId}', function() {

    describe('GET', function() {

      it('returns the collection descriptor', async function() {

        const colId = 'col1'
        const colDesc: OgcApiFeatures.CollectionDescriptorJson = {
          id: colId,
          title: 'Collection 1',
          description: 'A test collection',
          links: [],
          crs: [ OgcApiFeatures.CrsWgs84 ],
          extent: {
            spatial: {
              crs: OgcApiFeatures.CrsWgs84,
              bbox: [[ 1, 1, 2, 2 ]]
            }
          }
        }

        const source: SourceDescriptorEntity = new SourceDescriptorModel({
          title: 'Source 1',
          adapter: mongoose.Types.ObjectId().toHexString(),
          isReadable: true,
          isWritable: false,
          url: 'https://source1.test.net'
        })
        const collectionDescriptors = new Map([
          [ colId, colDesc ]
        ])
        const featuresAdapterPromise = Promise.resolve(featuresAdapter)
        when(sourceRepoMock.findById(source.id as string)).thenResolve(source)
        when(manifoldServiceMock.getAdapterForSource(source)).thenCall(() => {
          return featuresAdapterPromise
        })
        when(featuresAdapterMock.getCollections()).thenResolve(collectionDescriptors)

        const res = await request(app).get(`/manifold/sources/${source.id}/collections/${colId}`)

        expect(res.status).to.equal(200)
        expect(res.type).to.match(/^application\/json/)
        expect(res.body).to.deep.equal(colDesc)
      })
    })
  })

  describe('path /{sourceId}/collections/{collectionId}/items', function() {

    describe('GET', function() {

      it('returns all the features', async function() {

        const sourceEntity = new SourceDescriptorModel({
          adapter: new mongoose.Types.ObjectId().toHexString(),
          title: 'Source A',
          description: 'All the As',
          url: 'https://a.test/data'
        })
        const page: OgcApiFeatures.CollectionPage = {
          collectionId: 'a1',
          items: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [ 100, 30 ]
                },
                properties: {
                  lerp: 'ner'
                }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [ 101, 29 ]
                },
                properties: {
                  squee: 'bouf'
                }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [ 102, 27 ]
                },
                properties: {
                  noich: 'sna'
                }
              }
            ]
          }
        }
        when(sourceRepoMock.findById(sourceEntity.id)).thenResolve(sourceEntity)
        when(manifoldServiceMock.getAdapterForSource(sourceEntity)).thenResolve(featuresAdapter)
        when(featuresAdapterMock.getItemsInCollection(page.collectionId)).thenResolve(page)

        const res = await request(app).get(`/manifold/sources/${sourceEntity.id}/collections/${page.collectionId}/items`)

        expect(res.status).to.equal(200)
        expect(res.type).to.match(/^application\/geo\+json/)
        expect(res.body).to.deep.equal(page.items)
      })
    })
  })

  describe('path /{sourceId}/collections/{collectoinId}/items/{featureId}', function() {

  })
})
