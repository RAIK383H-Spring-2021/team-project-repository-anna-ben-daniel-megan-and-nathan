class AuthController < ApplicationController

  def general_auth
    id = authorized()

    unless id
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return false
    end

    return id
  end

  def user_auth(id)
    unless id == params[:id].to_i
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return false
    end

    return true
  end

  def host_auth(id, host_id)
    unless id == host_id
      respond_to do |format|
        format.json { render json: { error: :unauthorized }, status: :unauthorized }
      end

      return false
    end

    return true
  end

end