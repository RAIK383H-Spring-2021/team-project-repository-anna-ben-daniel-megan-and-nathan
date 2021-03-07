class ApplicationController < ActionController::API
    include ActionController::MimeResponds

    def encode(payload)
        JWT.encode(payload, 'test')
    end

    def auth_header
        request.headers['Authorization']
    end

    def decode_token
        if auth_header
            token = auth_header.split(' ')[1]
            begin
                JWT.decode(token, 'test', true, algorithm: 'HS256')
            rescue JWT::DecodeError
                nil
            end
        end
    end

    def logged_in_user
        if decode_token
            @id = decoded[0]['user_id']
            @user = User.find_by(id: id)
        end
    end

    def logged_in?
        !! logged_in_user
    end

    def authorized
        render json: { message: 'Please log in' }, status: :unauthorized unless logged_in?
    end

end
