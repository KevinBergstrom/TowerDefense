
describe('Model', () => {
  it('starts the wave', done => {
    done()
    model.startWave()
    expect(model.waveStarted).to.equal(true)
  })
})