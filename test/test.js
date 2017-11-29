
describe('Model', () => {
  it('starts the wave', done => {
    model.startWave()
    expect(model.waveStarted).to.equal(true)
    done()
  })
  it('ends the wave', done => {
    model.startWave()
    model.endWave()
    expect(model.waveStarted).to.equal(false)
    done()
  })
  it('updates players money', done => {
    model.money = 0
    model.changeMoney(100)
    expect(model.getMoney()).to.equal(100)
    done()
  })
  it('takes damage', done => {
    model.health = 100
    model.takeDamage(50)
    expect(model.getHealth()).to.equal(50)
    done()
  })
})