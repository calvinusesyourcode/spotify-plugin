#!/usr/bin/env bun
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { action } from 'lusat'
import { z } from 'zod'
import { jarvis } from '../jarvis/jarvis.ts'

async function searchSongsByQuery({ searchQuery }: { searchQuery: string }) {
  const spotify = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID || ((await jarvis.env.retrieve('SPOTIFY_CLIENT_ID')) as string),
    process.env.SPOTIFY_CLIENT_SECRET || ((await jarvis.env.retrieve('SPOTIFY_CLIENT_SECRET')) as string),
  )
  const result = (await spotify.search(searchQuery, ['track'])).tracks.items[0]
  return {
    id: result.id,
    title: result.name,
    artist: result.artists[0].name,
  }
}

export default {
  actions: {
    searchTracksByQuery: action()
      .describe('Search for tracks by query')
      .input(z.object({ searchQuery: z.string() }))
      .handle(searchSongsByQuery),
  },
}
