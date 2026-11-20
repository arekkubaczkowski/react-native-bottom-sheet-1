package com.swmansion.reactnativebottomsheet.host

import org.junit.Assert.assertArrayEquals
import org.junit.Test

class CornerRadiiTest {
  private val surface = floatArrayOf(32f, 24f, 16f, 8f)

  private fun radii(position: Float, lower: Float, distance: Float): FloatArray {
    val detents =
      listOf(lower, 800f).map { DetentSpec(it, programmatic = false, insets = DetentInsets()) }
    val styles = listOf(DetentCornerRadius(null, 0f), DetentCornerRadius(0f, distance))
    return FloatArray(4).also { resolveCornerRadii(position, detents, styles, surface, it) }
  }

  @Test
  fun `the clip keeps its surface radii before the transition starts`() {
    assertArrayEquals(surface, radii(749f, lower = 400f, distance = 50f), 0f)
    assertArrayEquals(surface, radii(750f, lower = 400f, distance = 50f), 0f)
  }

  @Test
  fun `all four radii reach zero at the upper detent`() {
    assertArrayEquals(floatArrayOf(16f, 12f, 8f, 4f), radii(775f, 400f, 50f), 0f)
    assertArrayEquals(FloatArray(4), radii(800f, 400f, 50f), 0f)
  }

  @Test
  fun `a short interval caps the distance and zero blends over the entire interval`() {
    val halfway = floatArrayOf(16f, 12f, 8f, 4f)
    assertArrayEquals(halfway, radii(785f, 770f, 50f), 0f)
    assertArrayEquals(halfway, radii(600f, 400f, 0f), 0f)
  }
}
